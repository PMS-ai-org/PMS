using Microsoft.AspNetCore.Mvc;
using PMS_WEBAPI.Models;
using PMS_WEBAPI.Services;

namespace PMS_WEBAPI.Controllers;

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

    [HttpGet("{id:int}", Name = "GetPatient")]
    public ActionResult<Patient> GetById(int id)
    {
        var patient = _service.GetById(id);
        if (patient is null) return NotFound();
        return Ok(patient);
    }

    [HttpPost]
    public ActionResult<Patient> Create([FromBody] Patient patient)
    {
        var created = _service.Add(patient);
        return CreatedAtRoute("GetPatient", new { id = created.Id }, created);
    }
}
