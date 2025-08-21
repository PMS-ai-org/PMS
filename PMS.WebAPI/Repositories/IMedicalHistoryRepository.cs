using PMS.WebAPI.Models;

namespace PMS.WebAPI.Repositories
{
    public interface IMedicalHistoryRepository
    {
        Task<IEnumerable<MedicalHistory>> GetByPatientIdAsync(Guid patientId);
        Task<MedicalHistory?> GetByIdAsync(Guid id);
        Task<MedicalHistory> CreateAsync(MedicalHistory history);
        Task<bool> UpdateAsync(Guid id, MedicalHistory history);
        Task<bool> DeleteAsync(Guid id);
    }
}