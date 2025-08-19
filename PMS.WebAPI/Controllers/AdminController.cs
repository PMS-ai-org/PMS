using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models.Dtos;
using PMS.WebAPI.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PMS.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AdminController(ApplicationDbContext db) => _db = db;

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles() => Ok(await _db.Roles.ToListAsync());

        [HttpGet("features")]
        public async Task<IActionResult> GetFeatures() => Ok(await _db.Features.ToListAsync());

        
        [HttpPost("assign-access")]
        public async Task<IActionResult> AssignAccess(Guid userClinicSiteId, [FromBody] PermissionDto[] permissions)
        {
            var ucs = await _db.UserClinicSites.FindAsync(userClinicSiteId);
            if (ucs == null) return NotFound();

            foreach (var p in permissions)
            {
                var existing = await _db.UserAccesses.FirstOrDefaultAsync(x => x.UserClinicSiteId == userClinicSiteId && x.FeatureId == p.FeatureId);
                if (existing == null)
                {
                    var feature = await _db.Features.FindAsync(p.FeatureId);
                    var ua = new UserAccess
                    {
                        UserClinicSiteId = userClinicSiteId,
                        FeatureId = p.FeatureId,
                        CanAdd = p.CanAdd,
                        CanEdit = p.CanEdit,
                        CanDelete = p.CanDelete,
                        CanView = p.CanView,
                        UserClinicSite = ucs,
                        Feature = feature
                    };
                    _db.UserAccesses.Add(ua);
                }
                else
                {
                    existing.CanAdd = p.CanAdd;
                    existing.CanEdit = p.CanEdit;
                    existing.CanDelete = p.CanDelete;
                    existing.CanView = p.CanView;
                }
            }
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
