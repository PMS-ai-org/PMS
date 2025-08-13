using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models;
using PMS.WebAPI.Models.Dtos;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(AppDbContext db, IPasswordHasher<object> hasher, ITokenService tokenSvc) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var existingUser = await db.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (existingUser is not null)
            {
                // Verify password — if correct, treat it like login
                var verify = hasher.VerifyHashedPassword(new object(), existingUser.PasswordHash, dto.Password);
                if (verify == PasswordVerificationResult.Failed)
                    return Unauthorized(new { message = "Invalid password." });

                var (token, exp) = tokenSvc.CreateToken(existingUser);
                return Ok(new AuthResponseDto(token, exp, existingUser.Email));
            }

            // Create new user
            var user = new User { Email = email };
            user.PasswordHash = hasher.HashPassword(new object(), dto.Password);
            db.Users.Add(user);
            await db.SaveChangesAsync();

            var (newToken, newExp) = tokenSvc.CreateToken(user);
            return Ok(new AuthResponseDto(newToken, newExp, user.Email));
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null)
                return Unauthorized(new { message = "Invalid credentials." });

            var result = hasher.VerifyHashedPassword(new object(), user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid credentials." });

            var (token, exp) = tokenSvc.CreateToken(user);
            return Ok(new AuthResponseDto(token, exp, user.Email));
        }
    }
}