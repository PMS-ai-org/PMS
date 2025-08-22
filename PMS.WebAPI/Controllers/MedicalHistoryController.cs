using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalHistory>>> Get([FromQuery] Guid? patientId)
        {
            var items = await _service.GetAllAsync(patientId);
            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<MedicalHistory>> GetById(Guid id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<MedicalHistory>> Create([FromBody] MedicalHistory history)
        {
            var created = await _service.AddAsync(history);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MedicalHistory history)
        {
            var updated = await _service.UpdateAsync(id, history);
            if (updated == null) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}