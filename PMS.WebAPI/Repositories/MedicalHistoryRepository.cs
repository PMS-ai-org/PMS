using Microsoft.EntityFrameworkCore;
using PMS.Data;
using PMS.Models;

namespace PMS.Repositories
{
    public class MedicalHistoryRepository : IMedicalHistoryRepository
    {
        private readonly PmsDbContext _context;

        public MedicalHistoryRepository(PmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MedicalHistory>> GetByPatientIdAsync(Guid patientId)
        {
            return await _context.MedicalHistories.Where(m => m.PatientId == patientId).ToListAsync();
        }

        public async Task<MedicalHistory?> GetByIdAsync(Guid id)
        {
            return await _context.MedicalHistories.FindAsync(id);
        }

        public async Task<MedicalHistory> CreateAsync(MedicalHistory history)
        {
            _context.MedicalHistories.Add(history);
            await _context.SaveChangesAsync();
            return history;
        }

        public async Task<bool> UpdateAsync(Guid id, MedicalHistory history)
        {
            var existing = await _context.MedicalHistories.FindAsync(id);
            if (existing == null) return false;
            _context.Entry(existing).CurrentValues.SetValues(history);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _context.MedicalHistories.FindAsync(id);
            if (existing == null) return false;
            _context.MedicalHistories.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}