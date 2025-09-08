using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models;
using PMS.WebAPI.Models.Dtos;
using PMS.WebAPI.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PMS.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicsController : ControllerBase
    {
        private readonly PmsDbContext _context;
        private readonly IEmailService _emailService;

        public ClinicsController(PmsDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Get all clinics
        /// </summary>
        [HttpGet("get-clinics")]
        public async Task<IActionResult> GetClinics()
        {
            var clinics = await _context.Clinics.ToListAsync();
            return Ok(clinics);
        }

        /// <summary>
        /// Get sites
        /// </summary>
        [HttpGet("get-sites")]
        public async Task<IActionResult> GetSites()
        {
            var sites = await _context.Sites.ToListAsync();
            return Ok(sites);
        }

        /// <summary>
        /// Get user clinic sites
        /// </summary>
        [HttpGet("get-user-clinic-sites")]
        public async Task<IActionResult> GetUserClinicSites()
        {
            var sites = await _context.UserClinicSites.ToListAsync();
            return Ok(sites);
        }


        [HttpGet("get-staff")]
        public async Task<IActionResult> GetStaffList()
        {
            
            var staffList = from ul in _context.UserLogins
                            join ud in _context.UserDetails on ul.UserId equals ud.UserId
                            join rl in _context.Roles on ul.RoleId equals rl.RoleId
                            where ul.IsActive == true
                            select new
                            {
                                ud.FullName,
                                ud.Email,
                                role = rl.RoleName,
                                userId = ul.UserId
                            };
            return Ok(staffList);
        }
        /// <summary>
        /// Get sites by clinicId
        /// </summary>
        [HttpGet("{clinicId}/sites")]
        public async Task<IActionResult> GetSitesByClinic(Guid clinicId)
        {
            var sites = await _context.Sites
                .Where(s => s.clinic_id == clinicId)
                .ToListAsync();

            if (!sites.Any())
                return NotFound($"No sites found for clinicId {clinicId}");

            return Ok(sites);
        }

        [HttpPost("create-doctor")]
        public async Task<IActionResult> CreateDoctor([FromBody] RegisterDoctorDto dto)
        {
            if (await _context.UserLogins.AnyAsync(u => u.Username == dto.Email))
                return BadRequest("User already exists");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var defaultPassword = Guid.NewGuid().ToString();

                // 1. Create User
                var user = new UserLogin
                {
                    Username = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(defaultPassword),
                    RoleId = dto.RoleId,
                    IsFirstLogin = true,
                    Role = await _context.Roles.FindAsync(dto.RoleId)
                };
                _context.UserLogins.Add(user);
                await _context.SaveChangesAsync();

                // 2. Create User Detail
                var detail = new UserDetail
                {
                    Email = dto.Email,
                    UserId = user.UserId,
                    FullName = dto.FullName,
                    PhoneNumber = dto.PhoneNumber,
                    Specialization = dto.Specialization,
                    Address = string.Empty
                };
                _context.UserDetails.Add(detail);

                // 3. Map clinic-sites & permissions
                foreach (var cs in dto.ClinicSites)
                {
                    var map = new UserClinicSite
                    {
                        UserId = user.UserId,
                        ClinicId = cs.ClinicId,
                        SiteId = cs.SiteId,
                        UserLogin = user
                    };
                    _context.UserClinicSites.Add(map);
                    await _context.SaveChangesAsync(); // save so map.UserClinicSiteId is available

                    if (dto.Access != null && dto.Access.ContainsKey(cs.SiteId))
                    {
                        var userAccesses = dto.Access[cs.SiteId]
                            .Select(permission => new UserAccess
                            {
                                UserClinicSiteId = map.UserClinicSiteId,
                                FeatureId = permission.FeatureId,
                                CanAdd = permission.CanAdd,
                                CanEdit = permission.CanEdit,
                                CanDelete = permission.CanDelete,
                                CanView = permission.CanView
                            }).ToList();

                        _context.UserAccesses.AddRange(userAccesses);
                    }
                }

                // 4. Create reset token
                var reset = new PasswordResetToken
                {
                    Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                    Expires = DateTime.UtcNow.AddDays(1),
                    UserId = user.UserId
                };
                _context.PasswordResetTokens.Add(reset);

                // Save everything together
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                // 5. Send Email (non-transactional)
                var loginUrl = "https://pms-ruddy-three.vercel.app/login";
                var body = $@"
            Hi {dto.FullName},<br/><br/>
            Your account has been created.<br/>
            <b>Username:</b> {dto.Email}<br/>
            <b>Password:</b> {defaultPassword}<br/><br/>
            Please login here: <a href='{loginUrl}'>{loginUrl}</a><br/><br/>
            Regards,<br/>PMS Team
        ";

                await _emailService.SendEmailAsync(dto.Email, "Account Activation", body);

                return Ok(new { user.UserId, resetToken = reset.Token });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error creating doctor: {ex.Message}");
            }
        }

        [HttpGet("{userId}/get-access")]
        public async Task<IActionResult> GetAccess(Guid userId)
        {
            var userAccess = (from ua in _context.UserAccesses
                              join ucs in _context.UserClinicSites on ua.UserClinicSiteId equals ucs.UserClinicSiteId
                              join f in _context.Features on ua.FeatureId equals f.FeatureId
                              join sites in _context.Sites on ucs.SiteId equals sites.id
                              where ucs.UserId == userId
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
              .AsEnumerable() // switch to LINQ-to-Objects for grouping
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
              }).ToList();

            return Ok(userAccess);
        }
    }
}
