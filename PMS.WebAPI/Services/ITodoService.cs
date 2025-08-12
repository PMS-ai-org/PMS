using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Todo>> GetAllAsync();
        Task<Todo?> GetByIdAsync(Guid id);
        Task<Todo> AddAsync(Todo todo);
        Task UpdateAsync(Todo todo);
        Task DeleteAsync(Guid id);
        Task<Todo> GetByIdAsync(int id);
    }
}