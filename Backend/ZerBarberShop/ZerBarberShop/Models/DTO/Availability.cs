namespace ZerBarberShop.Models.DTO;

public class Availability
{
    public int Id { get; set; }
    public string Date { get; set; } = string.Empty;
    public List<string> TimeSlots { get; set; } = new();
}