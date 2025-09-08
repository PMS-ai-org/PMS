using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    [Table("appointments")]
    public class Appointment
    {
        [Key]
        public Guid id { get; set; }
        [ForeignKey("patients")]
        public Guid patient_id { get; set; }
        public DateTime booked_at { get; set; }
        public DateTime scheduled_at { get; set; }
        public bool reminder_sent { get; set; }
        public string status { get; set; }
        public double? lead_time_hours { get; set; }
        public int? dow { get; set; }
        public int? hour_of_day { get; set; }
        public Guid? site_id { get; set; }
        public Guid? clinic_id { get; set; }
        public string? treatment_plan { get; set; } // Store as JSON string
    }
}