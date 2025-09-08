using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Token { get; set; }

        [Required]
        public DateTime Expires { get; set; }

        public bool IsRevoked { get; set; } = false;

        [Required, ForeignKey(nameof(UserLogin))]
        public Guid UserId { get; set; }
        public UserLogin UserLogin { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;
        public string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; }
        public string ReplacedByToken { get; set; }
    }
}
