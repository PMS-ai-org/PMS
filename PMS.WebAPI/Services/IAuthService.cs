using PMS.WebAPI.Models;
using PMS.WebAPI.Models.Dtos;
using System;
using System.Threading.Tasks;

namespace PMS.WebAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress);
        Task<AuthResponse> RefreshTokenAsync(string token, string ipAddress);
        Task<bool> LogoutAsync(string refreshToken);
        Task<bool> RegisterDoctorAsync(RegisterDoctorDto dto);
        Task<bool> RegisterStaffAsync(RegisterUserDto dto);
        Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto, string frontendBaseUrl);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
