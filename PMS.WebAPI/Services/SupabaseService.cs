using Supabase;

//using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

public class SupabaseSecretsService : IHostedService
{
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _env;

    public SupabaseSecretsService(IConfiguration configuration, IHostEnvironment env)
    {
        _configuration = configuration;
        _env = env;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var url = _configuration["Supabase:Url"];
        var key = _configuration["Supabase:Key"];

        var client = new Supabase.Client(url, key, new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true,
            Schema = "vault"
        });
        await client.InitializeAsync();

        var result = await client.From<Secret>().Get();

        if (result?.Models != null)
        {
            var dict = new Dictionary<string, string>();

            foreach (var secret in result.Models)
            {
                dict[$"Secrets:{secret.name}"] = secret.value;
            }

            // Inject into configuration at runtime
            var memConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(dict)
                .Build();

            ((IConfigurationRoot)_configuration).Providers
                .ToList()
                .Add(memConfig.Providers.First());


            //Setup DB Connection String
            var dbSecret = result.Models.FirstOrDefault(s => s.name == "ConnectionString");
            if (dbSecret != null)
            {
                // Inject into IConfiguration
                var configRoot = (IConfigurationRoot)_configuration;
                foreach (var provider in configRoot.Providers)
                {
                    provider.Set("ConnectionStrings:DefaultConnection", dbSecret.value);
                }
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}

[Supabase.Postgrest.Attributes.Table("decrypted_secrets")]
class Secret : BaseModel
{
    [Supabase.Postgrest.Attributes.PrimaryKey("id")]
    public Guid id { get; set; }

    [Supabase.Postgrest.Attributes.Column("name")]
    public string? name { get; set; }

    [Supabase.Postgrest.Attributes.Column("decrypted_secret")]
    public string? value { get; set; }

}
