using PMS.WebAPI.Models;
using System.Collections.Concurrent;

namespace PMS.WebAPI.Services;

public class PatientService : IPatientService
{
    private readonly ConcurrentDictionary<Guid, Patient> _store = new();

    public PatientService()
    {
        // Seed sample data
        var p1 = new Patient { FirstName = "Asha", LastName = "Sharma", DateOfBirth = new DateTime(1985, 5, 12), Gender = "Female" };
        var p2 = new Patient { FirstName = "Rohit", LastName = "Kumar", DateOfBirth = new DateTime(1990, 9, 1), Gender = "Male" };
        Add(p1);
        Add(p2);
    }

    public Patient Add(Patient patient)
    {
        if (patient.Id == Guid.Empty) patient.Id = Guid.NewGuid();
        _store[patient.Id] = patient;
        return patient;
    }

    public IEnumerable<Patient> GetAll() => _store.Values.OrderBy(p => p.LastName).ThenBy(p => p.FirstName);

    public Patient? GetById(Guid id) => _store.TryGetValue(id, out var p) ? p : null;

    public void Remove(Guid id) => _store.TryRemove(id, out _);

    public void Clear() => _store.Clear();
}
