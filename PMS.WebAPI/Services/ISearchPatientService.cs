using PMS.WebAPI.Models.Search;

namespace PMS.WebAPI.Services;

public interface ISearchPatientService
{
    Task<SearchPatientResponse> SearchAsync(
        string query,
        int pageSize = 20,
        int pageIndex = 0,
        CancellationToken ct = default);
}
