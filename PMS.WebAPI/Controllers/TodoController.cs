using Microsoft.AspNetCore.Mvc;
using PMS.WebAPI.Models;
using PMS.WebAPI.Services;

namespace PMS.WebAPI.Controllers;

[ApiController]
[Route("api/todo")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoRepo;

    public TodoController(ITodoService todoRepo)
    {
        _todoRepo = todoRepo;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> Get()
    {
        var todos = await _todoRepo.GetAllAsync();
        return Ok(todos);
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> Post([FromBody] Todo todo)
    {
        var created = await _todoRepo.AddAsync(todo);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] Todo todo)
    {
        if (id != todo.Id) return BadRequest();

        var existing = await _todoRepo.GetByIdAsync(id);
        if (existing == null) return NotFound();

        existing.Title = todo.Title;
        existing.IsComplete = todo.IsComplete;

        await _todoRepo.UpdateAsync(existing);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _todoRepo.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _todoRepo.DeleteAsync(id);
        return NoContent();
    }
}

