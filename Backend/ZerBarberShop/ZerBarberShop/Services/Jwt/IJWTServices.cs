using ZerBarberShop.Models;

namespace ZerBarberShop.Services.Jwt;

public interface IJWTServices
{
    string GenerateToken(IdentityUsers identityUsers);
    bool ValidateToken(string token);
    string RefreshToken();
}