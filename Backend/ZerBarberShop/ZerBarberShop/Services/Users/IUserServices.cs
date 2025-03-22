using ZerBarberShop.Models;

namespace ZerBarberShop.Services.Users;
public interface IUserServices
{
    IdentityUsers GetByEmail(string email);
    IdentityUsers GetByRefreshToken(string refreshToken);
    void CreateUser(IdentityUsers users);
    void UpdateUser(IdentityUsers users);
    IdentityRole GetRoleByName(string roleName);
    IdentityUsers GetById(int id);
}