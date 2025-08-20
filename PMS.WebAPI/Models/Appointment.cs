using System;

namespace PMS.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public DateTime BookedAt { get; set; }
        public DateTime ScheduledAt { get; set; }
        public bool ReminderSent { get; set; }
        public string Status { get; set; }
        public double? LeadTimeHours { get; set; }
        public int? Dow { get; set; }
        public int? HourOfDay { get; set; }
        public Guid? SiteId { get; set; }
        public Guid? ClinicId { get; set; }
        public string TreatmentPlan { get; set; } // Store as JSON string
    }
}