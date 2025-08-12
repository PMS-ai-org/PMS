using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _service;

    public PatientsController(IPatientService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Patient>> Get()
    {
        return Ok(_service.GetAll());
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Patient> GetById(Guid id)
    {
        var patient = _service.GetById(id);
        if (patient is null) return NotFound();
        return Ok(patient);
    }

    [HttpPost]
    public ActionResult<Patient> Create([FromBody] Patient patient)
    {
        var created = _service.Add(patient);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        var existing = _service.GetById(id);
        if (existing is null) return NotFound();
        _service.Remove(id);
        return NoContent();
    }
}
