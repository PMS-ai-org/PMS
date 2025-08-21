using System;

namespace PMS.WebAPI.Models
{
    public class Patient
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public DateTime? Dob { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int? Age { get; set; }
        public string[] Conditions { get; set; }
        public string[] Medications { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? HomeClinicId { get; set; }
        public Guid? HomeSiteId { get; set; }
    }
}