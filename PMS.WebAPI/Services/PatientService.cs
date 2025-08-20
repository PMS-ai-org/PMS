using PMS.Models;
using PMS.Repositories;

namespace PMS.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _repository;

        public PatientService(IPatientRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Patient>> GetAllAsync() => _repository.GetAllAsync();
        public Task<Patient> GetByIdAsync(Guid id) => _repository.GetByIdAsync(id);
        public Task<Patient> CreateAsync(Patient patient) => _repository.CreateAsync(patient);
        public Task<bool> UpdateAsync(Guid id, Patient patient) => _repository.UpdateAsync(id, patient);
        public Task<bool> DeleteAsync(Guid id) => _repository.DeleteAsync(id);
        public async Task<(IEnumerable<Patient> Results, int TotalCount)> SearchAsync(string query, int page, int pageSize)
        {
            return await _repository.SearchAsync(query, page, pageSize);
        }
    }
}