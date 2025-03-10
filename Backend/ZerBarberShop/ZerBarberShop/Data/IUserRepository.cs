using ZerBarberShop.Models;

namespace ZerBarberShop.Data;

public interface IUserRepository
{
    Users Create(Users user);
    Users GetByEmail(string email);
    Users GetById(int id);
}