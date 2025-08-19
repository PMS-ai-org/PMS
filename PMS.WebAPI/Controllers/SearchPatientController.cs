using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models.Search;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers;

[ApiController]
[Route("api/search")]
public class SearchPatientController : ControllerBase
{
    private readonly ISearchPatientService _service;

    public SearchPatientController(ISearchPatientService service)
    {
        _service = service;
    }

    /// <summary>
    /// Search patients by name, phone, conditions, medications, etc.
    /// </summary>
    /// <param name="q">Search text (required)</param>
    /// <param name="pageSize">Number of results per page (default 20, max 100)</param>
    /// <param name="pageIndex">Page number starting from 0</param>
    [HttpGet("patients")]
    [ProducesResponseType(typeof(SearchPatientResponse), 200)]
    public async Task<ActionResult<SearchPatientResponse>> Search(
        [FromQuery] string q,
        [FromQuery] int pageSize = 20,
        [FromQuery] int pageIndex = 0,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Search query (q) is required.");

        var result = await _service.SearchAsync(q, pageSize, pageIndex, ct);
        return Ok(result);
    }
}
