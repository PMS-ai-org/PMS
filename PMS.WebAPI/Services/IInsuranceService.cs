using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public interface IInsuranceService
    {
        Task<IEnumerable<InsuranceProvider>> GetProvidersAsync();
        Task<IEnumerable<InsurancePlan>> GetPlansAsync();
        //Task<IEnumerable<InsurancePlan>> GetPlansByProviderAsync(Guid providerId);

        Task<IEnumerable<PatientInsurance>> GetPatientInsurancesAsync(Guid patientId);
        Task<PatientInsurance?> GetPatientInsuranceAsync(Guid id);
        Task<PatientInsurance> AddPatientInsuranceAsync(PatientInsurance entity);
        Task<PatientInsurance?> UpdatePatientInsuranceAsync(Guid id, PatientInsurance entity);
        Task<bool> DeletePatientInsuranceAsync(Guid id);
    }
}
