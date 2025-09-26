using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PMS.WebAPI.Models
{
    [Table("patients")]
    public class Patient
    {
        [Key]
        public Guid id { get; set; }
        public string? full_name { get; set; }
        public DateTime? dob { get; set; }
        public string? gender { get; set; }
        public string? phone { get; set; }
        public string? email { get; set; }
        public string? address { get; set; }
        public int? age { get; set; }
        public string[]? conditions { get; set; }
        public string[]? medications { get; set; }
        public string? notes { get; set; }
        public DateTime created_at { get; set; }
        public Guid? home_clinic_id { get; set; }
        public Guid? home_site_id { get; set; }
        public bool? hasInsurance { get; set; } // new flag updated when insurance records are added
        public Guid? insuranceId { get; set; }
    }
}