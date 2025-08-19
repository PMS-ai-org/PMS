using System;
using System.Collections.Generic;

namespace PMS.WebAPI.Models.Dtos
{
    public record LoginRequest(string Username, string Password);
    public record AuthResponse(string AccessToken, string? RefreshToken = null, DateTime? ExpiresAt = null, string? Role = null, Guid? UserId = null, bool? RequirePasswordReset = null, string? fullName = null, object? UserAccessDetail = null);
    public record RegisterUserDto(string Username, string Email, string FullName, string Password, Guid RoleId, string PhoneNumber = null);
    public record RegisterDoctorDto(string Email, string FullName, string PhoneNumber, string Specialization, Guid RoleId, List<ClinicSiteDto> ClinicSites, Dictionary<Guid, PermissionDto[]> Access); // Access can be simplified
    public record ClinicSiteDto(Guid ClinicId, Guid SiteId);
    public record PermissionDto(Guid FeatureId, bool CanAdd, bool CanEdit, bool CanDelete, bool CanView);
    public record ForgotPasswordDto(string Email);
    public record ResetPasswordDto(Guid UserId, string Token, string NewPassword);
    public record RefreshRequest(string RefreshToken);

    public record RegisterStaffDto(
    string Username,
    string Email,
    string FullName,
    string PhoneNumber,
    Guid RoleId,
    Guid ClinicId,
    Guid SiteId,
    Dictionary<Guid, PermissionDto[]>? Access // optional if staff has permissions
    );

}