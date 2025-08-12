using Microsoft.EntityFrameworkCore;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Todo> Todos => Set<Todo>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
