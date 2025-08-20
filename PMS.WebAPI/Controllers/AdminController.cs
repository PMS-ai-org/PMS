using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models.Dtos;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly PmsDbContext _db;
        public AdminController(PmsDbContext db) => _db = db;

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles() => Ok(await _db.Roles.ToListAsync());

        [HttpGet("features")]
        public async Task<IActionResult> GetFeatures() => Ok(await _db.Features.ToListAsync());


        [HttpPut("assign-access")]
        public async Task<IActionResult> AssignAccess([FromBody]  PermissionDto[] Permissions)
        {
            if (Permissions == null || !Permissions.Any())
                return BadRequest("No permissions provided");

            foreach (var rowData in Permissions)
            {
                var userAccess = await _db.UserAccesses.FindAsync(rowData.UserAccessId);
                if (userAccess == null) return NotFound();

                var existing = await _db.UserAccesses
                    .FirstOrDefaultAsync(x => x.UserAccessId == userAccess.UserAccessId && x.FeatureId == rowData.FeatureId);

                if (existing != null)
                {
                    existing.CanAdd = rowData.CanAdd;
                    existing.CanEdit = rowData.CanEdit;
                    existing.CanDelete = rowData.CanDelete;
                    existing.CanView = rowData.CanView;
                }
                await _db.SaveChangesAsync();
            }
            return Ok();
        }

    }
}
