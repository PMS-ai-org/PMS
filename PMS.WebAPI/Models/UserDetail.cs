using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    public class UserDetail: AuditableEntity
    {
        [Key]
        public Guid UserDetailId { get; set; } = Guid.NewGuid();

        [Required, ForeignKey(nameof(UserLogin))]
        public Guid UserId { get; set; }
        public UserLogin? UserLogin { get; set; }

        [Required, MaxLength(150)]
        public string FullName { get; set; }

        [Required, MaxLength(150)]
        public required string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Specialization { get; set; } // for doctors
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
