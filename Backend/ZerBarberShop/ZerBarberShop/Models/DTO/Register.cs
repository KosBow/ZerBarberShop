using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZerBarberShop.Models.DTO;

public class Register
{
    [Required][EmailAddress] public string Email { get; set; } 
    [Required][MinLength(6)] public string Password { get; set; }
    [Required][MinLength(6)] public string ConfirmPassword { get; set; }
    public bool PasswordsMatch => Password == ConfirmPassword;
}