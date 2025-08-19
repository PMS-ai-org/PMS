using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    [Table("medical_history", Schema = "pms")]
    public class MedicalHistory : AuditableEntity
    {
        [Column("id")]
        public Guid Id { get; set; }

        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Column("code")]
        public string Code { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("source")]
        public string? Source { get; set; }

        // [Column("recorded_at")]
        // public DateTime RecordedAt { get; set; }

        [Column("clinic_id")]
        public Guid? ClinicId { get; set; }

        [Column("site_id")]
        public Guid? SiteId { get; set; }
    }
}
