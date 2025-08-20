using PMS.Models;

namespace PMS.Repositories
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<IEnumerable<Patient>> SearchAsync(string query);
        Task<Patient?> GetByIdAsync(Guid id);
        Task<Patient> CreateAsync(Patient patient);
        Task<bool> UpdateAsync(Guid id, Patient patient);
        Task<bool> DeleteAsync(Guid id);
        Task<(IEnumerable<Patient> Results, int TotalCount)> SearchAsync(string query, int page, int pageSize);
    }
}