using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;
using System.Security.Cryptography;
using System.Text;
using ZerBarberShop.Models;

using ZerBarberShop.Services.Users;

namespace ZerBarberShop.Services.Jwt;

public class JwtServices : IJWTServices
{
    private readonly string _secureKey = Environment.GetEnvironmentVariable("SECRET") ??
                                         throw new ApplicationException("SECRET not found.");

    private readonly IUserServices _userService;

    public JwtServices(IUserServices userService)
    {
        _userService = userService;
    }
    public string GenerateToken(IdentityUsers identityUsers)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secureKey));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var expires = int.Parse(Environment.GetEnvironmentVariable("JWT_SECRET_EXPIRES") ?? "15");

        var updatedUser = _userService.GetByEmail(identityUsers.Email);
        if (updatedUser == null)
        {
            throw new Exception("User not found.");
        }
        var role = updatedUser.Role?.RoleId ?? "User";

        Console.WriteLine($"User RoleId: {updatedUser.RoleId}, Role Name: {updatedUser.Role?.RoleId}");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, identityUsers.Id.ToString()),
            new Claim(ClaimTypes.Name, identityUsers.UserName),
            new Claim(ClaimTypes.Email, identityUsers.Email),
            new Claim(JwtRegisteredClaimNames.Exp, DateTime.Now.AddMinutes(expires).ToString()),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("ISSUER"),
            audience: Environment.GetEnvironmentVariable("AUDIENCE"),
            claims: claims,
            expires: DateTime.Now.AddMinutes(expires),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    public bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameter = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secureKey)),
            ValidateIssuer = false, // Change to true when we have a Domain.
            ValidateAudience = false // Change to true when we have a Domain.
        };
        try
        {
            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, validationParameter, out validatedToken);
            return principal != null;
        }
        catch (SecurityTokenException)
        {
            return false;
        }
    }

    public string RefreshToken()
    {
        var refreshToken = new byte[32];
        using (var randomToken = new RNGCryptoServiceProvider())
        {
            randomToken.GetBytes(refreshToken);
        }
        return Convert.ToBase64String(refreshToken);
    }
}