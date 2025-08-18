using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// --- Database registrations ---
// EF Core DbContext (still needed if you use EF for other entities)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add NpgsqlDataSource for low-level ADO.NET access in SearchPatientService
// Register connection for DI
builder.Services.AddScoped<NpgsqlConnection>(sp =>
{
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection")!;
    return new NpgsqlConnection(connStr);
});

// --- Identity / Tokens ---
builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();
builder.Services.Configure<TokenService.JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<ITokenService, TokenService>();

// --- App Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IPatientService, PatientService>();
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<ISearchPatientService, SearchPatientService>();

// --- CORS for Angular dev server ---
var allowAngular = "AllowAngular";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowAngular,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- JWT auth ---
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors(allowAngular);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();

//TODO: Added to test pipeline code
