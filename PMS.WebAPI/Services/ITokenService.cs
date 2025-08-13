using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public interface ITokenService
    {
        (string token, DateTime expiresUtc) CreateToken(User user);
    }
}
