using Microsoft.EntityFrameworkCore;
using ZerBarberShop.Models;

namespace ZerBarberShop.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}