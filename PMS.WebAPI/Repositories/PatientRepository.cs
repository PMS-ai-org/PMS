using Microsoft.EntityFrameworkCore;
using PMS.Data;
using PMS.Models;

namespace PMS.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly PmsDbContext _context;

        public PatientRepository(PmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task<Patient> GetByIdAsync(Guid id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<Patient> CreateAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> UpdateAsync(Guid id, Patient patient)
        {
            var existing = await _context.Patients.FindAsync(id);
            if (existing == null) return false;
            _context.Entry(existing).CurrentValues.SetValues(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _context.Patients.FindAsync(id);
            if (existing == null) return false;
            _context.Patients.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    public async Task<(IEnumerable<Patient> Results, int TotalCount)> SearchAsync(string query, int page, int pageSize)
{
    var q = _context.Patients
        .Where(p => p.FullName.Contains(query) || p.Phone.Contains(query) || p.Email.Contains(query));
    var totalCount = await q.CountAsync();
    var results = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    return (results, totalCount);
}
    }

}