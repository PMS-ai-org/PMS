using Microsoft.EntityFrameworkCore;
using PMS.Data;
using PMS.Models;

namespace PMS.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly PmsDbContext _context;

        public AppointmentRepository(PmsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(Guid patientId)
        {
            return await _context.Appointments.Where(a => a.PatientId == patientId).ToListAsync();
        }

        public async Task<Appointment?> GetByIdAsync(Guid id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<Appointment> CreateAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> UpdateAsync(Guid id, Appointment appointment)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return false;
            _context.Entry(existing).CurrentValues.SetValues(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null) return false;
            _context.Appointments.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}