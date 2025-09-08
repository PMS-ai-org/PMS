using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Npgsql;
using PMS.WebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using PMS.WebAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register hosted service to fetch secrets on startup
builder.Services.AddHostedService<SupabaseSecretsService>();

var secretsService = new SupabaseSecretsService(builder.Configuration, builder.Environment);
await secretsService.StartAsync(CancellationToken.None);

// --- Database registrations ---
// EF Core DbContext (still needed if you use EF for other entities)
builder.Services.AddDbContext<PmsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Password hasher (PBKDF2)
// Add NpgsqlDataSource for low-level ADO.NET access in SearchPatientService
// Register connection for DI
builder.Services.AddScoped<NpgsqlConnection>(sp =>
{
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection")!;
    return new NpgsqlConnection(connStr);
});

//builder.Configuration.GetValue<string>("DefaultConnection"))
// configure settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddHttpContextAccessor();

// authorization handler
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

// JWT auth
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
var key = Encoding.UTF8.GetBytes(jwt.Secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwt.Issuer,
        ValidateAudience = true,
        ValidAudience = jwt.Audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


// --- Identity / Tokens ---
builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();
builder.Services.Configure<TokenService.JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IMedicalHistoryRepository, MedicalHistoryRepository>();
builder.Services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();

// --- App Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<ISearchPatientService, SearchPatientService>();

// --- CORS for Angular dev server ---
var allowAngular = "AllowAngular";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowAngular,
        policy =>
        {
            policy.WithOrigins("*")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// // apply migrations at startup (optional)
// using (var scope = app.Services.CreateScope())
// {
//      var db = scope.ServiceProvider.GetRequiredService<PmsDbContext>();
//     // db.Database.Migrate();

//     // seed roles/features/admin
//     var seeder = new DbSeeder(db, builder.Configuration);
//     await seeder.SeedAsync();
// }

app.UseCors(allowAngular);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();