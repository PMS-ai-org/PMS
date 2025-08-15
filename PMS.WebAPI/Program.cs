using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Data;
using PMS.WebAPI.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Register hosted service to fetch secrets on startup
builder.Services.AddHostedService<SupabaseSecretsService>();

var secretsService = new SupabaseSecretsService(builder.Configuration, builder.Environment);
await secretsService.StartAsync(CancellationToken.None);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Configuration.GetValue<string>("DefaultConnection"))

// Password hasher (PBKDF2)
builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();
// Token service
builder.Services.Configure<TokenService.JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<ITokenService, TokenService>();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Simple in-memory PatientService
builder.Services.AddSingleton<IPatientService, PatientService>();
builder.Services.AddScoped<ITodoService, TodoService>();

// CORS for Angular dev server
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

// JWT auth
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