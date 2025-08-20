using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    public class UserAccess: AuditableEntity
    {
        [Key]
        public Guid UserAccessId { get; set; } = Guid.NewGuid();

        [Required, ForeignKey(nameof(UserClinicSite))]
        public Guid UserClinicSiteId { get; set; }
        public UserClinicSite? UserClinicSite { get; set; }

        [Required, ForeignKey(nameof(Feature))]
        public Guid FeatureId { get; set; }
        public Feature? Feature { get; set; }

        public bool CanAdd { get; set; } = false;
        public bool CanEdit { get; set; } = false;
        public bool CanDelete { get; set; } = false;
        public bool CanView { get; set; } = true;
    }
}
