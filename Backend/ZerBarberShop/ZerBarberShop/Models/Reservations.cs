namespace ZerBarberShop.Models;

public class Reservations
{
    public int Id { get; set; }
    public string Email { get; set; }
    public DateTime Date { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; }
    

    public IdentityUsers User { get; set; }
}