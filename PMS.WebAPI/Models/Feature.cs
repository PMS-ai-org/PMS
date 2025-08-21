using System;
using System.ComponentModel.DataAnnotations;

namespace PMS.WebAPI.Models
{
    public class Feature : AuditableEntity
    {
        [Key]
        public Guid FeatureId { get; set; }
        [Required]
        public required string FeatureName { get; set; }
        [Required]
        public required string RouterLink { get; set; }

    }
}
