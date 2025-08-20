using System;
using System.ComponentModel.DataAnnotations;

namespace PMS.WebAPI.Models
{
    public class Feature : AuditableEntity
    {
        [Key]
        public Guid FeatureId { get; set; } = Guid.NewGuid();
        [Required]
        public required string FeatureName { get; set; }
    }
}
