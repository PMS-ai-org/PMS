using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Models;
using System;

namespace PMS.WebAPI.Data
{
    public class ApplicationDbContext : DbContext
    {

        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
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
        public DbSet<MedicalHistory> MedicalHistories { get; set; }

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

            builder.Entity<MedicalHistory>(entity =>
            {
                entity.ToTable("medical_history", "pms");

                entity.Property(m => m.Id).HasColumnName("id");
                entity.Property(m => m.PatientId).HasColumnName("patient_id");
                entity.Property(m => m.Code).HasColumnName("code");
                entity.Property(m => m.Description).HasColumnName("description");
                entity.Property(m => m.Source).HasColumnName("source");
                entity.Property(m => m.created_at).HasColumnName("created_at");
                entity.Property(m => m.ClinicId).HasColumnName("clinic_id");
                entity.Property(m => m.SiteId).HasColumnName("site_id");

                // 👇 Ignore inherited audit columns
                entity.Ignore(m => m.created_at);
                entity.Ignore(m => m.created_by);
                entity.Ignore(m => m.updated_at);
                entity.Ignore(m => m.updated_by);
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
