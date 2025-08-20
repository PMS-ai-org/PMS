using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models.Dtos;
using PMS.WebAPI.Services;
using System;
using System.Threading.Tasks;

namespace PMS.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) => _auth = auth;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                var result = await _auth.LoginAsync(request, ip);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // For first-login we return 400 with message; frontend should catch and route to reset flow.
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
        {
            try
            {
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                var res = await _auth.RefreshTokenAsync(req.RefreshToken, ip);
                return Ok(res);
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
        {
            await _auth.LogoutAsync(req.RefreshToken);
            return Ok();
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var frontendBaseUrl = Request.Headers["X-Frontend-BaseUrl"].ToString(); // pass frontend url via header
            if (string.IsNullOrEmpty(frontendBaseUrl)) frontendBaseUrl = "https://your-frontend-url";

            var ok = await _auth.ForgotPasswordAsync(dto, frontendBaseUrl);
            return Ok(new { success = ok });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                await _auth.ResetPasswordAsync(dto);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
