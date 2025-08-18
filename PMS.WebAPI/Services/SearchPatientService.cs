using Npgsql;
using PMS.WebAPI.Models.Search;

namespace PMS.WebAPI.Services;

public class SearchPatientService : BaseDatabaseService, ISearchPatientService
{
    public SearchPatientService(NpgsqlConnection conn) : base(conn) { }

    public async Task<SearchPatientResponse> SearchAsync(
        string query, int pageSize = 20, int pageIndex = 0, CancellationToken ct = default)
    {
        var term = (query ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(term))
        {
            return new SearchPatientResponse
            {
                Total = 0,
                Items = new List<SearchPatientItem>()
            };
        }

        pageSize = Math.Clamp(pageSize, 1, 100);
        pageIndex = Math.Max(0, pageIndex);
        var offset = pageIndex * pageSize;

        const string COUNT_SQL = @"
            with qry as (select websearch_to_tsquery('english', @q) as q)
            select count(*)::bigint
            from pms.patients p, qry
            where p.search_vector @@ qry.q;
        ";

        const string PAGE_SQL = @"
            with qry as (select websearch_to_tsquery('english', @q) as q)
            select
              p.id,
              p.full_name,
              p.age,
              coalesce(p.gender,'') as gender,
              p.phone,
              p.email,
              p.address,
              p.conditions,
              p.medications,
              ts_rank(p.search_vector, qry.q) as rank,
              nullif(ts_headline('english', coalesce(p.notes,''), qry.q,
                                 'MaxFragments=1, MinWords=5, MaxWords=12'), '') as snippet
            from pms.patients p, qry
            where p.search_vector @@ qry.q
            order by rank desc, p.full_name asc
            limit @limit offset @offset;
        ";

        await using var conn = await OpenAsync(ct);

        long total;
        await using (var ccmd = Cmd(conn, COUNT_SQL, ("q", term)))
        {
            total = (long)(await ccmd.ExecuteScalarAsync(ct))!;
        }

        var items = new List<SearchPatientItem>();
        await using (var cmd = Cmd(conn, PAGE_SQL, ("q", term), ("limit", pageSize), ("offset", offset)))
        await using (var r = await cmd.ExecuteReaderAsync(ct))
        {
            while (await r.ReadAsync(ct))
            {
                string[]? Arr(int i) => r.IsDBNull(i) ? null : r.GetFieldValue<string[]>(i);

                items.Add(new SearchPatientItem
                {
                    Id = r.GetGuid(0),
                    FullName = r.GetString(1),
                    Age = r.IsDBNull(2) ? null : r.GetInt32(2),
                    Gender = r.IsDBNull(3) ? "" : r.GetString(3),
                    Phone = r.IsDBNull(4) ? null : r.GetString(4),
                    Email = r.IsDBNull(5) ? null : r.GetString(5),
                    Address = r.IsDBNull(6) ? null : r.GetString(6),
                    Conditions = Arr(7),
                    Medications = Arr(8),
                    Rank = r.GetDouble(9),
                    Snippet = r.IsDBNull(10) ? null : r.GetString(10)
                });
            }
        }

        return new SearchPatientResponse
        {
            Total = total,
            Items = items
        };
    }
}
