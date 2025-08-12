using PMS.WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Simple in-memory PatientService
builder.Services.AddSingleton<IPatientService, PatientService>();

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

var app = builder.Build();

app.UseCors(allowAngular);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
