namespace PMS.WebAPI.Models;

public class Patient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string? Gender { get; set; }
}
