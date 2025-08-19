using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public interface IMedicalHistoryService
    {
        Task<IEnumerable<MedicalHistory>> GetAllAsync(Guid? patientId = null);
        Task<MedicalHistory?> GetByIdAsync(Guid id);
        Task<MedicalHistory> AddAsync(MedicalHistory history);
        Task<MedicalHistory?> UpdateAsync(Guid id, MedicalHistory history);
        Task<bool> DeleteAsync(Guid id);
    }
}
