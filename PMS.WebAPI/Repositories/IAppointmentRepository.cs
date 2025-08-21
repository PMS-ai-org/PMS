using PMS.WebAPI.Models;

namespace PMS.WebAPI.Repositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetByPatientIdAsync(Guid patientId);
        Task<IEnumerable<Appointment>> GetAllAppointmentsAsync();
        Task<Appointment?> GetByIdAsync(Guid id);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<bool> UpdateAsync(Guid id, Appointment appointment);
        Task<bool> DeleteAsync(Guid id);
    }
}