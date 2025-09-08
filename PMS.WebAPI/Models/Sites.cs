using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

[Table("sites")]
public class Sites:AuditableEntity
{
    [Key]
    public Guid id { get; set; } = Guid.NewGuid();
    [ForeignKey("clinics")]
    public Guid? clinic_id { get; set; }
    public string? name { get; set; }
    public string? neighborhood { get; set; }
    public string? address { get; set; }
    public string? city { get; set; }
    public string? state { get; set; }
    public double? lat { get; set; }
    public double? lon { get; set; }
}