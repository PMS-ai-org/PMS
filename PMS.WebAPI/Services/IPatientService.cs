using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services;

public interface IPatientService
{
    IEnumerable<Patient> GetAll();
    Patient? GetById(Guid id);
    Patient Add(Patient patient);
    void Remove(Guid id);
    void Clear();
}
