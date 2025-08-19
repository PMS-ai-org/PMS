using Npgsql;

namespace PMS.WebAPI.Services;

public abstract class BaseDatabaseService
{
    private readonly NpgsqlConnection _conn;

    protected BaseDatabaseService(NpgsqlConnection conn)
    {
        _conn = conn;
    }

    protected async Task<NpgsqlConnection> OpenAsync(CancellationToken ct = default)
    {
        if (_conn.State != System.Data.ConnectionState.Open)
            await _conn.OpenAsync(ct);

        return _conn;
    }

    protected static NpgsqlCommand Cmd(NpgsqlConnection conn, string sql, params (string, object)[] args)
    {
        var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        foreach (var (name, value) in args)
            cmd.Parameters.AddWithValue(name, value ?? DBNull.Value);
        return cmd;
    }
}
