using ZerBarberShop.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ZerBarberShop.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public Users Create(Users user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public Users GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public Users GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }
    }
}