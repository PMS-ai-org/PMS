using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Todo> Todos => Set<Todo>();

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
        }
        #endregion
    }
}
