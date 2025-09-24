using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PMS.WebAPI.Models
{
  [Table("InsuranceProviders")]
  public class InsuranceProvider
  {
    public Guid id { get; set; }
    public string? name { get; set; }
    public string? phone { get; set; }
    public string? email { get; set; }
  }

  [Table("InsurancePlans")]
  public class InsurancePlan
  {
    public Guid id { get; set; }
    public string? name { get; set; }
    public decimal price { get; set; }
    // Potential future: public Guid providerId { get; set; } to relate plan to provider
  }

  // Updated model to align with existing legacy table structure PatientInsurances_old
  // pms."PatientInsurances_old" columns:
  // id (PK), patientId, providerId, planId (nullable), policyNumber, memberId,
  // isPrimary (bool), effectiveDate, expirationDate, created_at, priority (smallint)
  [Table("PatientInsurances_old")]
  [Index(nameof(patientId), nameof(policyNumber), IsUnique = true)]
  public class PatientInsurance
  {
    public Guid id { get; set; }
    public Guid patientId { get; set; }

    public Guid providerId { get; set; }
    public InsuranceProvider? provider { get; set; }

    public Guid? planId { get; set; }
    public InsurancePlan? plan { get; set; }

    public string? policyNumber { get; set; }
    public string? memberId { get; set; }
    public bool isPrimary { get; set; }
    public DateTime? effectiveDate { get; set; }
    public DateTime? expirationDate { get; set; }
    public short? priority { get; set; }
  }

  public class PatientInsuranceDto
  {
    public Guid? patientId { get; set; }
    public Guid? providerId { get; set; }
    public Guid? planId { get; set; }
    public string? policyNumber { get; set; }
    public string? memberId { get; set; }
    public bool isPrimary { get; set; }
    public DateTime? effectiveDate { get; set; }
    public DateTime? expirationDate { get; set; }
    public short? priority { get; set; }
  }
}