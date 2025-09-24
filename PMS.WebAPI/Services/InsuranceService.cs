using PMS.WebAPI.Models;
using PMS.WebAPI.Repositories;

namespace PMS.WebAPI.Services
{
    public class InsuranceService : IInsuranceService
    {
        private readonly IInsuranceRepository _repo;

        public InsuranceService(IInsuranceRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<InsuranceProvider>> GetProvidersAsync() => _repo.GetProvidersAsync();
        public Task<IEnumerable<InsurancePlan>> GetPlansAsync() => _repo.GetPlansAsync();
        //public Task<IEnumerable<InsurancePlan>> GetPlansByProviderAsync(Guid providerId) => _repo.GetPlansByProviderAsync(providerId);
        public Task<IEnumerable<PatientInsurance>> GetPatientInsurancesAsync(Guid patientId) => _repo.GetPatientInsurancesAsync(patientId);
        public Task<PatientInsurance?> GetPatientInsuranceAsync(Guid id) => _repo.GetPatientInsuranceAsync(id);
        public Task<PatientInsurance> AddPatientInsuranceAsync(PatientInsurance entity) => _repo.AddPatientInsuranceAsync(entity);
        public Task<PatientInsurance?> UpdatePatientInsuranceAsync(Guid id, PatientInsurance entity) => _repo.UpdatePatientInsuranceAsync(id, entity);
        public Task<bool> DeletePatientInsuranceAsync(Guid id) => _repo.DeletePatientInsuranceAsync(id);
    }
}
