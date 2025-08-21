using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models;
using PMS.WebAPI.Models.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PMS.WebAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly PmsDbContext _db;
        private readonly JwtSettings _jwtSettings;
        private readonly IEmailService _emailService;
        private readonly SmtpSettings _smtpSettings;

        // lockout config
        private const int MAX_FAILED_ATTEMPTS = 5;
        private readonly TimeSpan LOCKOUT_DURATION = TimeSpan.FromMinutes(15);

        public AuthService(PmsDbContext db, IOptions<JwtSettings> jwtOpt, IEmailService emailService, IOptions<SmtpSettings> smtpOpt)
        {
            _db = db;
            _jwtSettings = jwtOpt.Value;
            _emailService = emailService;
            _smtpSettings = smtpOpt.Value;
        }

        private string HashPassword(string password) =>
            BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        private bool VerifyPassword(string password, string hash) =>
            BCrypt.Net.BCrypt.EnhancedVerify(password, hash);

        private string RandomTokenString()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private string GenerateJwtToken(UserLogin user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role?.RoleName ?? ""),
                new Claim("email", user.Username)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private RefreshToken CreateRefreshToken(string ipAddress, Guid userId)
        {
            var token = new RefreshToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress,
                UserId = userId
            };
            return token;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress)
        {
            var user = await _db.UserLogins
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
                throw new Exception("Invalid credentials");

            if (user.IsLocked)
            {
                if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow)
                    throw new Exception($"Account locked until {user.LockoutEnd.Value} UTC");
                // release lock if ended
                user.IsLocked = false;
                user.FailedAttempts = 0;
                user.LockoutEnd = null;
                await _db.SaveChangesAsync();
            }

            if (!VerifyPassword(request.Password, user.PasswordHash))
            {
                user.FailedAttempts++;
                if (user.FailedAttempts >= MAX_FAILED_ATTEMPTS)
                {
                    user.IsLocked = true;
                    user.LockoutEnd = DateTime.UtcNow.Add(LOCKOUT_DURATION);
                }
                await _db.SaveChangesAsync();
                throw new Exception("Invalid credentials");
            }

            // successful login: reset failed attempts
            user.FailedAttempts = 0;
            user.IsLocked = false;
            user.LockoutEnd = null;
            await _db.SaveChangesAsync();

            if (user.IsFirstLogin)
            {
                // On first login, do not issue tokens. Force reset via email.
                // Create a password reset token & send
                var resetToken = new PasswordResetToken
                {
                    Token = RandomTokenString(),
                    Expires = DateTime.UtcNow.AddHours(24),
                    UserId = user.UserId,
                    IsUsed = false
                };
                _db.PasswordResetTokens.Add(resetToken);
                await _db.SaveChangesAsync();

                // send email with reset link (frontend URL must be provided by caller or configured)
                // For login endpoint we can respond with a flag so frontend will show "check email" screen
                //throw new Exception("FirstLogin: reset required. Check email for reset link.");
                return new AuthResponse(AccessToken: resetToken.Token,
                                        UserId: user.UserId,
                                        RequirePasswordReset: user.IsFirstLogin,
                                        fullName: user.Username);
            }


        
            var result = new List<object>();

            if (user.Role?.RoleName == "Admin") // <-- Replace with your Admin check logic
            {
                result = (from site in _db.Sites
                          join ucs in _db.UserClinicSites on site.id equals ucs.SiteId
                          where ucs.UserId == user.UserId
                          select new
                          {
                              ucs.ClinicId,
                              ucs.SiteId,
                              SiteName = site.name,
                              ucs.UserClinicSiteId
                          })
                          .AsEnumerable()
                          .GroupBy(x => x.ClinicId)
                          .Select(clinicGroup => new
                          {
                              ClinicId = clinicGroup.Key,
                              Sites = clinicGroup.Select(siteItem => new
                              {
                                  siteItem.SiteId,
                                  siteItem.SiteName,
                                  siteItem.UserClinicSiteId,
                                  Features = _db.Features
                                               .Select(f => new
                                               {
                                                   f.FeatureId,
                                                   f.FeatureName,
                                                   CanAdd = true,
                                                   CanEdit = true,
                                                   CanDelete = true,
                                                   CanView = true,
                                                   UserAccessId = 0 // dummy since Admin doesn’t need actual mapping
                                               }).ToList()
                              }).ToList()
                          }).ToList<object>();
            }
            else
            {
                result = (from ua in _db.UserAccesses
                          join ucs in _db.UserClinicSites on ua.UserClinicSiteId equals ucs.UserClinicSiteId
                          join f in _db.Features on ua.FeatureId equals f.FeatureId
                          join sites in _db.Sites on ucs.SiteId equals sites.id
                          where ucs.UserId == user.UserId
                          select new
                          {
                              ucs.ClinicId,
                              ucs.SiteId,
                              sites.name,
                              ucs.UserClinicSiteId,
                              ua.UserAccessId,
                              f.FeatureId,
                              f.FeatureName,
                              ua.CanAdd,
                              ua.CanEdit,
                              ua.CanDelete,
                              ua.CanView
                          })
                          .AsEnumerable()
                          .GroupBy(x => x.ClinicId)
                          .Select(clinicGroup => new
                          {
                              ClinicId = clinicGroup.Key,
                              Sites = clinicGroup
                                  .GroupBy(s => s.SiteId)
                                  .Select(siteGroup => new
                                  {
                                      SiteId = siteGroup.Key,
                                      SiteName = siteGroup.First().name,
                                      UserClinicSiteId = siteGroup.First().UserClinicSiteId,
                                      Features = siteGroup.Select(f => new
                                      {
                                          f.FeatureId,
                                          f.FeatureName,
                                          f.CanAdd,
                                          f.CanEdit,
                                          f.CanDelete,
                                          f.CanView,
                                          f.UserAccessId
                                      }).ToList()
                                  }).ToList()
                          }).ToList<object>();
            }
            // generate tokens
            var jwt = GenerateJwtToken(user);
            var refresh = CreateRefreshToken(ipAddress, user.UserId);
            _db.RefreshTokens.Add(refresh);
            await _db.SaveChangesAsync();

            return new AuthResponse(jwt, refresh.Token, DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            user.Role.RoleName, user.UserId, user.IsFirstLogin, user.Username, result);
        }

        public async Task<AuthResponse> RefreshTokenAsync(string token, string ipAddress)
        {
            var existing = await _db.RefreshTokens
                .Include(rt => rt.UserLogin)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(x => x.Token == token);

            if (existing == null || existing.IsRevoked || existing.Expires < DateTime.UtcNow)
                throw new Exception("Invalid refresh token");

            // rotate refresh token
            existing.IsRevoked = true;
            existing.Revoked = DateTime.UtcNow;
            existing.RevokedByIp = ipAddress;

            var newRefresh = CreateRefreshToken(ipAddress, existing.UserId);
            existing.ReplacedByToken = newRefresh.Token;

            _db.RefreshTokens.Add(newRefresh);

            var jwt = GenerateJwtToken(existing.UserLogin);
            await _db.SaveChangesAsync();
            return new AuthResponse(jwt, newRefresh.Token, DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            existing.UserLogin.Role.RoleName, existing.UserId, false);
        }

        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var existing = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);
            if (existing == null) return true;
            existing.IsRevoked = true;
            existing.Revoked = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RegisterStaffAsync(RegisterUserDto dto)
        {
            if (await _db.UserLogins.AnyAsync(u => u.Username == dto.Username))
                throw new Exception("User exists");

            var user = new UserLogin
            {
                Username = dto.Username,
                PasswordHash = HashPassword(dto.Password),
                RoleId = dto.RoleId,
                IsFirstLogin = true,
                Role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleId == dto.RoleId)
            };
            _db.UserLogins.Add(user);
            await _db.SaveChangesAsync();

            var detail = new UserDetail
            {
                UserId = user.UserId,
                Email = dto.Email, // Assuming Email is required for staff
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Address = string.Empty, // Set to empty or a default value; update as needed
                Specialization = string.Empty // Set to empty or a default value; update as needed
            };
            _db.UserDetails.Add(detail);
            await _db.SaveChangesAsync();

            // create password reset and send email (so admin-provided password isn't used)
            var reset = new PasswordResetToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(1),
                UserId = user.UserId
            };
            _db.PasswordResetTokens.Add(reset);
            await _db.SaveChangesAsync();

            // send email - use configured frontend URL for reset
            // This method requires a frontendBaseUrl in ForgotPassword step. For registration we assume Admin provides the frontend url OR we can construct.
            // For simplicity we skip email here (Admin workflow should call ForgotPassword)
            return true;
        }

        public async Task<bool> RegisterDoctorAsync(RegisterDoctorDto dto)
        {
            if (await _db.UserLogins.AnyAsync(u => u.Username == dto.Email))
                throw new Exception("User exists");

            var user = new UserLogin
            {
                Username = dto.Email,
                PasswordHash = HashPassword(Guid.NewGuid().ToString()), // random temp; force reset
                RoleId = dto.RoleId, // should be Doctor role id
                IsFirstLogin = true,
                Role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleId == dto.RoleId)
            };
            _db.UserLogins.Add(user);
            await _db.SaveChangesAsync();

            var detail = new UserDetail
            {
                Email = dto.Email,
                UserId = user.UserId,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Specialization = dto.Specialization,
                UserLogin = user,
                Address = string.Empty // Set to empty or a default value; update as needed
            };
            _db.UserDetails.Add(detail);
            await _db.SaveChangesAsync();

            // create clinic-site mappings
            foreach (var cs in dto.ClinicSites)
            {
                var map = new UserClinicSite
                {
                    UserId = user.UserId,
                    ClinicId = cs.ClinicId,
                    SiteId = cs.SiteId,
                    UserLogin = user
                };
                _db.UserClinicSites.Add(map);
                await _db.SaveChangesAsync();

                // apply accesses if provided - dto.Access keyed by ClinicSite? For simplicity, dto.Access uses FeatureId -> permissions
                if (dto.Access != null)
                {
                    // Note: dto.Access here is dictionary; adapt to your shape. We'll assume Access contains list of PermissionDto
                    // If Access holds global permissions per clinicSite, you should link them accordingly.
                    // Here we assume dto.Access is a Dictionary<FeatureId, PermissionDto[]>, but DTO earlier may be adapted by you.
                }
            }

            // create password reset token and send email
            var reset = new PasswordResetToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddDays(1),
                UserId = user.UserId
            };
            _db.PasswordResetTokens.Add(reset);
            await _db.SaveChangesAsync();
            // Email sending is left to caller who must provide frontend url. Alternatively send now if frontend url known.

            return true;
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto, string frontendBaseUrl)
        {
            var user = await _db.UserLogins.FirstOrDefaultAsync(u => u.Username == dto.Email);
            if (user == null) return false;

            var reset = new PasswordResetToken
            {
                Token = RandomTokenString(),
                Expires = DateTime.UtcNow.AddHours(24),
                UserId = user.UserId
            };
            _db.PasswordResetTokens.Add(reset);
            await _db.SaveChangesAsync();

            var resetLink = $"{frontendBaseUrl.TrimEnd('/')}/reset-password?token={Uri.EscapeDataString(reset.Token)}&userId={user.UserId}";
            var html = $"<p>Click <a href=\"{resetLink}\">here</a> to reset your password. Link expires in 24 hours.</p>";
            await _emailService.SendEmailAsync(user.Username, "Reset your password", html);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var pr = await _db.PasswordResetTokens
                .Include(x => x.UserLogin)
                .FirstOrDefaultAsync(x => x.UserId == dto.UserId && x.Token == dto.Token && !x.IsUsed);

            if (pr == null || pr.Expires < DateTime.UtcNow)
                throw new Exception("Invalid or expired token");

            // perform reset
            var user = pr.UserLogin;
            user.PasswordHash = HashPassword(dto.NewPassword);
            user.IsFirstLogin = false;
            user.DateModified = DateTime.UtcNow;

            pr.IsUsed = true;

            await _db.SaveChangesAsync();
            return true;
        }
    }
}
