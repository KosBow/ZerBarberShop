using System.ComponentModel.DataAnnotations;
using ZerBarberShop.Models;

namespace ZerBarberShop.Models
{
    


public class IdentityRole
{
    [Key] public string RoleId { get; set; }
    public string Name { get; set; }
    public ICollection<IdentityUsers> Users { get; set; }
}

}