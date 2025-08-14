namespace PMS.WebAPI.Models.Dtos
{
    public record AuthResponseDto(string AccessToken, DateTime ExpiresUtc, string Email);
}