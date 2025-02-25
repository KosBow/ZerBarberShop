using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZerBarberShop.Models.DTO
{
    public class RegisterRequestDto
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }  // Add this property

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public List<string> Roles { get; set; } = new List<string>();
    }
}
