using Microsoft.AspNetCore.Mvc;
using PMS.Models;
using PMS.Services;

namespace PMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalHistoryController : ControllerBase
    {
        private readonly IMedicalHistoryService _service;

        public MedicalHistoryController(IMedicalHistoryService service)
        {
            _service = service;
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            return Ok(await _service.GetByPatientIdAsync(patientId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var history = await _service.GetByIdAsync(id);
            if (history == null) return NotFound();
            return Ok(history);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MedicalHistory history)
        {
            var created = await _service.CreateAsync(history);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MedicalHistory history)
        {
            var updated = await _service.UpdateAsync(id, history);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}