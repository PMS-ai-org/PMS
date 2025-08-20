using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Data
{
    public class PmsDbContext : DbContext
    {
        public PmsDbContext(DbContextOptions<PmsDbContext> options) : base(options) { }

        public DbSet<Todo> Todos => Set<Todo>();
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalHistory> MedicalHistories { get; set; }

        #region Authentication
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<User>(e =>
            {
                e.HasIndex(x => x.Email).IsUnique();
                e.Property(x => x.Email).IsRequired().HasMaxLength(256);
                e.Property(x => x.PasswordHash).IsRequired();
                e.Property(x => x.CreatedUtc).HasDefaultValueSql("now() at time zone 'utc'");
            });
               modelBuilder.Entity<Patient>()
                .ToTable("patients", "pms")
                .HasKey(p => p.Id);

            modelBuilder.Entity<Appointment>()
                .ToTable("appointments", "pms")
                .HasKey(a => a.Id);               

            modelBuilder.Entity<MedicalHistory>()
                .ToTable("medical_history", "pms")
                .HasKey(m => m.Id);

            // Configure array types if needed, e.g.:
            modelBuilder.Entity<Patient>()
                .Property(p => p.Conditions)
                .HasColumnType("text[]");

            modelBuilder.Entity<Patient>()
                .Property(p => p.Medications)
                .HasColumnType("text[]");
        }
        #endregion
    }
}
