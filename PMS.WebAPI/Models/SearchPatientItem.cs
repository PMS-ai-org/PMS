using System;

namespace PMS.WebAPI.Models.Search;

public record SearchPatientItem
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = "";
    public int? Age { get; init; }
    public string Gender { get; init; } = "";
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public string? Address { get; init; }
    public string[]? Conditions { get; init; }
    public string[]? Medications { get; init; }
    public double Rank { get; init; }
    public string? Snippet { get; init; }
}

public record SearchPatientResponse
{
    public long Total { get; init; }
    public IReadOnlyList<SearchPatientItem> Items { get; init; } = Array.Empty<SearchPatientItem>();
}
