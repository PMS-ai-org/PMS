using PMS_WEBAPI.Models;

namespace PMS_WEBAPI.Services;

public interface IPatientService
{
    IEnumerable<Patient> GetAll();
    Patient? GetById(int id);
    Patient Add(Patient patient);
}
