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
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ClinicsController(ApplicationDbContext context, IEmailService emailService)
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
            // Ideally call a service. For brevity directly use db
            if (await _context.UserLogins.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
                return BadRequest("User exists");

            var defaultPassword = Guid.NewGuid().ToString();

            var user = new UserLogin
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(defaultPassword),
                RoleId = dto.RoleId,
                IsFirstLogin = true,
                Role = await _context.Roles.FindAsync(dto.RoleId)
            };
            _context.UserLogins.Add(user);
            await _context.SaveChangesAsync();

            var detail = new UserDetail
            {
                UserId = user.UserId,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Specialization = dto.Specialization,
                Address = string.Empty // Ensure dto.Address is provided in RegisterDoctorDto
            };
            _context.UserDetails.Add(detail);
            await _context.SaveChangesAsync();

            // Map clinic-sites
            foreach (var cs in dto.ClinicSites)
            {
                var map = new UserClinicSite
                {
                    UserId = user.UserId,
                    ClinicId = cs.ClinicId,
                    SiteId = cs.SiteId,
                    UserLogin = user // Set the required navigation property
                };
                _context.UserClinicSites.Add(map);
                await _context.SaveChangesAsync();

                // apply passed permissions (dto.Access) if any for this clinic-site
                // Expectation: dto.Access is a list mapping FeatureId -> permission
                // Here we assume dto.Access dictionary keyed by FeatureId or as permission list
            }

            // create reset token
            var reset = new PasswordResetToken
            {
                Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                Expires = DateTime.UtcNow.AddDays(1),
                UserId = user.UserId
            };
            _context.PasswordResetTokens.Add(reset);
            await _context.SaveChangesAsync();

            // send email - for simplicity we won't send here; call email service with front-end link
            // 6. Send welcome email with login link + default password
            var loginUrl = "https://myapp.com/login";
            var body = $@"
                Hi {dto.FullName},<br/><br/>
                Your doctor account has been created.<br/>
                <b>Username:</b> {dto.Email}<br/>
                <b>Password:</b> {defaultPassword}<br/><br/>
                Please login here: <a href='{loginUrl}'>{loginUrl}</a><br/><br/>
                Regards,<br/>PMS Team
            ";

            await _emailService.SendEmailAsync(dto.Email, "Your Doctor Account", body);


            return Ok(new { user.UserId, resetToken = reset.Token });
        }

    }
}
