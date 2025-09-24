using PMS.WebAPI.Models;

namespace PMS.WebAPI.Repositories
{
    public interface IInsuranceRepository
    {
        // Providers
        Task<IEnumerable<InsuranceProvider>> GetProvidersAsync();
        Task<InsuranceProvider?> GetProviderAsync(Guid id);

        // Plans
        //Task<IEnumerable<InsurancePlan>> GetPlansByProviderAsync(Guid providerId);
        Task<InsurancePlan?> GetPlanAsync(Guid id);
        Task<IEnumerable<InsurancePlan>> GetPlansAsync();

        // Patient Insurances
        Task<IEnumerable<PatientInsurance>> GetPatientInsurancesAsync(Guid patientId);
        Task<PatientInsurance?> GetPatientInsuranceAsync(Guid id);
        Task<PatientInsurance> AddPatientInsuranceAsync(PatientInsurance entity);
        Task<PatientInsurance?> UpdatePatientInsuranceAsync(Guid id, PatientInsurance entity);
        Task<bool> DeletePatientInsuranceAsync(Guid id);
    }
}
