using PMS.WebAPI.Models;
using PMS.WebAPI.Repositories;

namespace PMS.WebAPI.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly IMedicalHistoryRepository _repo;

        public MedicalHistoryService(IMedicalHistoryRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<MedicalHistory>> GetByPatientIdAsync(Guid patientId) => _repo.GetByPatientIdAsync(patientId);
        public Task<MedicalHistory?> GetByIdAsync(Guid id) => _repo.GetByIdAsync(id);
        public Task<MedicalHistory> CreateAsync(MedicalHistory history) => _repo.CreateAsync(history);
        public Task<bool> UpdateAsync(Guid id, MedicalHistory history) => _repo.UpdateAsync(id, history);
        public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);
    }
}