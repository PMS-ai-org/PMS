using Microsoft.Extensions.Configuration;
using PMS.WebAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PMS.WebAPI.Data
{
    public class DbSeeder
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public DbSeeder(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task SeedAsync()
        {
            if (!_db.Roles.Any())
            {
                _db.Roles.Add(new Role { RoleName = "Admin" });
                _db.Roles.Add(new Role { RoleName = "Doctor" });
                _db.Roles.Add(new Role { RoleName = "Staff" });
                await _db.SaveChangesAsync();
            }

            if (!_db.Features.Any())
            {
                _db.Features.Add(new Feature { FeatureName = "Patient" });
                _db.Features.Add(new Feature { FeatureName = "Appointment" });
                _db.Features.Add(new Feature { FeatureName = "TreatmentPlan" });
                _db.Features.Add(new Feature { FeatureName = "Feature4" });
                _db.Features.Add(new Feature { FeatureName = "Feature5" });
                await _db.SaveChangesAsync();
            }

            // create first admin from config if not exists
            var adminCfg = _config.GetSection("FirstAdmin");
            var adminEmail = adminCfg["Email"];
            if (!string.IsNullOrEmpty(adminEmail) && !_db.UserLogins.Any(u => u.Email == adminEmail))
            {
                var role = _db.Roles.FirstOrDefault(r => r.RoleName == "Admin");
                var user = new UserLogin
                {
                    Username = adminCfg["Username"] ?? "admin",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(adminCfg["Password"] ?? Guid.NewGuid().ToString()),
                    RoleId = role.RoleId,
                    IsFirstLogin = false // if you want them to reset, set true
                    
                };
                _db.UserLogins.Add(user);
                await _db.SaveChangesAsync();

                var detail = new UserDetail
                {
                    UserId = user.UserId,
                    FullName = adminCfg["FullName"] ?? "Administrator",
                    PhoneNumber = adminCfg["PhoneNumber"],
                    Address = " ",
                    Specialization = ""
                };
                _db.UserDetails.Add(detail);
                await _db.SaveChangesAsync();
            }
        }
    }
}
