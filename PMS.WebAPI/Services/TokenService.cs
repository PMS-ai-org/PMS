using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PMS.WebAPI.Models;

namespace PMS.WebAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtOptions _opts;
        public class JwtOptions
        {
            public string Issuer { get; set; } = "";
            public string Audience { get; set; } = "";
            public string Key { get; set; } = "";
            public int ExpiresMinutes { get; set; } = 15;
        }

        public TokenService(IOptions<JwtOptions> opts) => _opts = opts.Value;

        public (string token, DateTime expiresUtc) CreateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opts.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_opts.ExpiresMinutes);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var jwt = new JwtSecurityToken(
                issuer: _opts.Issuer,
                audience: _opts.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(jwt), expires);
        }
    }
}