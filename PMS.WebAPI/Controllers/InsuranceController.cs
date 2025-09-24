using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers
{
    [ApiController]
    [Route("api/insurance")] // base route
    public class InsuranceController : ControllerBase
    {
        private readonly IInsuranceService _service;

        public InsuranceController(IInsuranceService service)
        {
            _service = service;
        }

        // GET: /api/insurance/providers
        [HttpGet("providers")]
        public async Task<IActionResult> GetProviders()
        {
            var providers = await _service.GetProvidersAsync();
            return Ok(providers);
        }

        // GET: /api/insurance/providers/{providerId}/plans
        [HttpGet("plans")]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _service.GetPlansAsync();
            return Ok(plans);
        }

        // GET: /api/insurance/providers/{providerId}/plans
        // [HttpGet("providers/{providerId:guid}/plans")]
        // public async Task<IActionResult> GetPlansByProvider(Guid providerId)
        // {
        //     var plans = await _service.GetPlansByProviderAsync(providerId);
        //     return Ok(plans);
        // }

        // GET: /api/insurance/patients/{patientId}/insurances
        [HttpGet("patients/{patientId:guid}/insurances")]
        public async Task<IActionResult> GetPatientInsurances(Guid patientId)
        {
            var list = await _service.GetPatientInsurancesAsync(patientId);
            return Ok(list);
        }

        // GET: /api/insurance/patient-insurances/{id}
        [HttpGet("patient-insurances/{id:guid}")]
        public async Task<IActionResult> GetPatientInsurance(Guid id)
        {
            var entity = await _service.GetPatientInsuranceAsync(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

    // POST: /api/insurance/patients/{patientId}/insurances
        [HttpPost("patients/{patientId:guid}/insurances")]
        public async Task<IActionResult> AddPatientInsurance(Guid patientId, [FromBody] PatientInsurance payload)
        {
            if (payload.patientId == Guid.Empty) payload.patientId = patientId;
            if (payload.patientId != patientId) return BadRequest("PatientId mismatch.");

            var created = await _service.AddPatientInsuranceAsync(payload);
            return CreatedAtAction(nameof(GetPatientInsurance), new { id = created.id }, created);
        }

    // PUT: /api/insurance/patient-insurances/{id}
        [HttpPut("patient-insurances/{id:guid}")]
        public async Task<IActionResult> UpdatePatientInsurance(Guid id, [FromBody] PatientInsurance payload)
        {
            var updated = await _service.UpdatePatientInsuranceAsync(id, payload);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: /api/insurance/patient-insurances/{id}
        [HttpDelete("patient-insurances/{id:guid}")]
        public async Task<IActionResult> DeletePatientInsurance(Guid id)
        {
            var ok = await _service.DeletePatientInsuranceAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
