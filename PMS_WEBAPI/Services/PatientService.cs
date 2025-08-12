using PMS_WEBAPI.Models;

namespace PMS_WEBAPI.Services;

public class PatientService : IPatientService
{
    private readonly List<Patient> _patients = new()
    {
        new Patient { Id = 1, FirstName = "John", LastName = "Doe", DateOfBirth = new DateTime(1980,1,1), Notes = "Sample patient" },
        new Patient { Id = 2, FirstName = "Jane", LastName = "Smith", DateOfBirth = new DateTime(1990,5,20), Notes = "Sample patient" }
    };

    private int _nextId = 3;

    public IEnumerable<Patient> GetAll() => _patients;

    public Patient? GetById(int id) => _patients.FirstOrDefault(p => p.Id == id);

    public Patient Add(Patient patient)
    {
        var toAdd = patient with { Id = _nextId++ };
        _patients.Add(toAdd);
        return toAdd;
    }
}
