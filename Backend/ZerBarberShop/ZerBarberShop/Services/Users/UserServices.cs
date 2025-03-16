using Microsoft.EntityFrameworkCore;
using ZerBarberShop.Services.Users;
using ZerBarberShop.Data;
using ZerBarberShop.Models;

namespace ZerBarberShop.Services.Users;

public class UserServices : IUserServices
{
    private readonly DataContext _context;

    public UserServices(DataContext context)
    {
        _context = context;
    }

    public IdentityUsers GetByEmail(string email)
    {
        return _context.Users
            .Include(u => u.Role)
            .FirstOrDefault(u => u.Email == email);
    }


    public IdentityUsers GetByRefreshToken(string refreshToken)
    {
        return _context.Users.FirstOrDefault(user => user.RefreshToken == refreshToken);
    }


    public void CreateUser(IdentityUsers users)
    {
        if (string.IsNullOrEmpty(users.RoleId))
        {
            var defaultRole = GetRoleByName("User");
            if (defaultRole != null)
            {
                users.RoleId = defaultRole.RoleId;
                users.Role = defaultRole;
            }
        }

        _context.Users.Add(users);
        _context.SaveChanges();
    }
    public IdentityUsers GetById(int id)
    {
        return _context.Users.FirstOrDefault(u => u.Id == id);
    }
    public void UpdateUser(IdentityUsers users)
    {
        _context.Users.Update(users);
        _context.SaveChanges();
    }

    public IdentityRole GetRoleByName(string roleName)
    {
        return _context.Roles.FirstOrDefault(r => r.RoleId == roleName);
    }

}