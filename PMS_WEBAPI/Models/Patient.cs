namespace PMS_WEBAPI.Models;

public record Patient
{
    public int Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public DateTime DateOfBirth { get; init; }
    public string? Notes { get; init; }
}
