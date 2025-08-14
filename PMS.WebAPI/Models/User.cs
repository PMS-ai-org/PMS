namespace PMS.WebAPI.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public DateTime CreatedUtc { get; set; }
    }
}