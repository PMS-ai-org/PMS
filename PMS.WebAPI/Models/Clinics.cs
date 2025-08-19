using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("clinics")]
public class Clinics : AuditableEntity
{
    [Key]
    public Guid id { get; set; } = Guid.NewGuid();
    public string? name { get; set; }
    public string? specialty { get; set; }
}
