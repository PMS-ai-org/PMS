using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public class MedicalHistoryService : IMedicalHistoryService
    {
        private readonly PmsDbContext _context;

        public MedicalHistoryService(PmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MedicalHistory>> GetAllAsync(Guid? patientId = null)
        {
            var query = _context.MedicalHistories.AsQueryable();

            if (patientId.HasValue)
                query = query.Where(m => m.PatientId == patientId.Value);

            return await query.ToListAsync();
        }

        public async Task<MedicalHistory?> GetByIdAsync(Guid id)
        {
            return await _context.MedicalHistories.FindAsync(id);
        }

        public async Task<MedicalHistory> AddAsync(MedicalHistory history)
        {
            _context.MedicalHistories.Add(history);
            await _context.SaveChangesAsync();
            return history;
        }

        public async Task<MedicalHistory?> UpdateAsync(Guid id, MedicalHistory history)
        {
            var existing = await _context.MedicalHistories.FindAsync(id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(history);
            await _context.SaveChangesAsync();
            return existing;
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