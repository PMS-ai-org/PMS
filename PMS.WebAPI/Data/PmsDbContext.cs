using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Models;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace PMS.WebAPI.Data
{
    public class PmsDbContext : DbContext
    {

        private readonly IHttpContextAccessor _httpContextAccessor;

        public PmsDbContext(DbContextOptions<PmsDbContext> options,
            IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<UserClinicSite> UserClinicSites { get; set; }
        public DbSet<UserAccess> UserAccesses { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        public DbSet<Clinics> Clinics { get; set; }
        public DbSet<Sites> Sites { get; set; }

        // ==== Add these DbSets for patient-related tables ====
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalHistory> MedicalHistories { get; set; }
        // =====================================================
    // Insurance domain
    public DbSet<InsuranceProvider> InsuranceProviders { get; set; }
    public DbSet<InsurancePlan> InsurancePlans { get; set; }
    public DbSet<PatientInsurance> PatientInsurances { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasDefaultSchema("pms");

            base.OnModelCreating(builder);

            builder.Entity<Role>().HasIndex(r => r.RoleName).IsUnique();
            builder.Entity<Feature>().HasIndex(f => f.FeatureName).IsUnique();
            builder.Entity<UserLogin>().HasIndex(u => u.Username).IsUnique();
            builder.Entity<UserDetail>().HasIndex(u => u.Email).IsUnique();

            builder.Entity<UserClinicSite>()
                .HasIndex(x => new { x.UserId, x.ClinicId, x.SiteId })
                .IsUnique();

            builder.Entity<UserAccess>()
                .HasIndex(x => new { x.UserClinicSiteId, x.FeatureId })
                .IsUnique();

            // relations
            builder.Entity<UserLogin>()
                .HasOne(u => u.UserDetail)
                .WithOne(d => d.UserLogin)
                .HasForeignKey<UserDetail>(d => d.UserId);

            builder.Entity<Appointment>()
                .Property(a => a.treatment_plan)
                .HasColumnType("jsonb");

            // ===== Optionally add indexes/relations for new tables =====
            // e.g., builder.Entity<Patient>().HasIndex(p => p.PatientNumber).IsUnique();
            // e.g., builder.Entity<Appointment>().HasOne(a => a.Patient).WithMany(p => p.Appointments).HasForeignKey(a => a.PatientId);
            // ===========================================================

            // Insurance relations & indexes
            builder.Entity<InsurancePlan>()
                .HasIndex(p => new { p.id, p.name, p.price });

                        // PatientInsurance legacy table mapping (PatientInsurances_old)
                        builder.Entity<PatientInsurance>(pi =>
                        {
                                pi.HasOne(p => p.provider)
                                    .WithMany()
                                    .HasForeignKey(p => p.providerId)
                                    .OnDelete(DeleteBehavior.Restrict);

                                pi.HasOne(p => p.plan)
                                    .WithMany()
                                    .HasForeignKey(p => p.planId)
                                    .OnDelete(DeleteBehavior.Restrict);

                                pi.HasIndex(p => p.patientId)
                                    .HasDatabaseName("idx_patient_insurances_patient");

                                // Unique composite index (patientId, policyNumber) defined via attribute; ensuring alignment here if needed
                                // Filtered unique index for single primary per patient
                                pi.HasIndex(p => new { p.patientId, p.isPrimary })
                                    .HasFilter("\"isPrimary\" = true")
                                    .IsUnique()
                                    .HasDatabaseName("ux_patient_single_primary");
                        });

        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();

            foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.created_at = DateTime.UtcNow;
                    entry.Entity.created_by = userId;
                    entry.Entity.updated_at = DateTime.UtcNow;
                    entry.Entity.updated_by = userId;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.updated_at = DateTime.UtcNow;
                    entry.Entity.updated_by = userId;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        private Guid GetCurrentUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;
            return string.IsNullOrEmpty(userId) ? Guid.Empty : Guid.Parse(userId);
        }
    }
}