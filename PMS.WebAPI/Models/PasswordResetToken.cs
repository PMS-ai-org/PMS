using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    public class PasswordResetToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public required string Token { get; set; }

        [Required]
        public DateTime Expires { get; set; }

        [Required, ForeignKey(nameof(UserLogin))]
        public Guid UserId { get; set; }
        public UserLogin UserLogin { get; set; }

        public bool IsUsed { get; set; } = false;
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
