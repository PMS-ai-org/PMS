using System;

namespace PMS.Models
{
    public class MedicalHistory
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Source { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? ClinicId { get; set; }
        public Guid? SiteId { get; set; }
    }
}