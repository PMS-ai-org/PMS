using System;
using System.ComponentModel.DataAnnotations;

namespace PMS.WebAPI.Models
{
    public class Role: AuditableEntity
    {
        [Key]
        public Guid RoleId { get; set; } = Guid.NewGuid();

        [Required]
        public required string RoleName { get; set; }
    }
}
