using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient> GetByIdAsync(Guid id);
        Task<Patient> CreateAsync(Patient patient);
        Task<bool> UpdateAsync(Guid id, Patient patient);
        Task<bool> DeleteAsync(Guid id);
        
        Task<(IEnumerable<Patient> Results, int TotalCount)> SearchAsync(string query, int page, int pageSize);
    }
}