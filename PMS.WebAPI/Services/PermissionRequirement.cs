using Microsoft.AspNetCore.Authorization;

namespace PMS.WebAPI.Services
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string FeatureName { get; }
        public string Permission { get; } // "CanView", "CanAdd", "CanEdit", "CanDelete"

        public PermissionRequirement(string featureName, string permission)
        {
            FeatureName = featureName;
            Permission = permission;
        }
    }
}
