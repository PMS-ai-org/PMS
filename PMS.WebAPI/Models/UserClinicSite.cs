using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    public class UserClinicSite: AuditableEntity
    {
        [Key]
        public Guid UserClinicSiteId { get; set; } = Guid.NewGuid();

        [Required, ForeignKey(nameof(UserLogin))]
        public Guid UserId { get; set; }
        public UserLogin? UserLogin { get; set; }

        [Required]
        public Guid ClinicId { get; set; }  // reference to existing Clinic table

        [Required]
        public Guid SiteId { get; set; }    // reference to existing Site table

        // Unique constraint is added via DbContext fluent API
    }
}
