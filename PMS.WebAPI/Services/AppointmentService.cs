using PMS.WebAPI.Models;
using PMS.WebAPI.Repositories;

namespace PMS.WebAPI.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _repo;

        public AppointmentService(IAppointmentRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<Appointment>> GetByPatientIdAsync(Guid patientId) => _repo.GetByPatientIdAsync(patientId);
        public Task<Appointment?> GetByIdAsync(Guid id) => _repo.GetByIdAsync(id);
        public Task<Appointment> CreateAsync(Appointment appointment) => _repo.CreateAsync(appointment);
        public Task<bool> UpdateAsync(Guid id, Appointment appointment) => _repo.UpdateAsync(id, appointment);
        public Task<bool> DeleteAsync(Guid id) => _repo.DeleteAsync(id);
    }
}