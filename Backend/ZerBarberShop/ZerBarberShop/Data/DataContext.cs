using Microsoft.EntityFrameworkCore;
using ZerBarberShop.Models;


namespace ZerBarberShop.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<IdentityUsers>()
            .HasOne(user => user.Role)
            .WithMany(role => role.Users)
            .HasForeignKey(user => user.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { RoleId = "Admin", Name = "Administrator" },
            new IdentityRole { RoleId = "User", Name = "Regular User" }
        );
        modelBuilder.Entity<Reservations>()
            .HasOne(r => r.User)
            .WithMany()  
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict); 
    }
    public DbSet<IdentityUsers> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<Reservations> Reservations { get; set; }
}