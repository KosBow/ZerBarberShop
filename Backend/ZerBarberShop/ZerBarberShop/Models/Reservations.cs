namespace ZerBarberShop.Models;

public class Reservations
{
    public int Id { get; set; }
    public string Email { get; set; }
    public DateTime Date { get; set; }
    public int UserId { get; set; }
    public bool isPending { get; set; }
    public bool isAccepted { get; set; }
    public bool isCancelled { get; set; }
    public string Username { get; set; }

    public IdentityUsers User { get; set; }
}