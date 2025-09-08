using Microsoft.AspNetCore.Authorization;
using PMS.WebAPI.Data;
using PMS.WebAPI.Services;

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public PermissionHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                   PermissionRequirement requirement)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<PmsDbContext>();
            // Use dbContext here
        }

        return Task.CompletedTask;
    }
}
