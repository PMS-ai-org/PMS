using System.ComponentModel.DataAnnotations;
namespace PMS.WebAPI.Models
{
    public class Todo
    {
        [Key]
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
        public DateTime InsertedAt { get; set; } = DateTime.UtcNow;
    }

}
