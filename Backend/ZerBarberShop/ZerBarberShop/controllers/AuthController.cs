using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ZerBarberShop.Models.DTO;

namespace ZerBarberShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;

        public AuthController(UserManager<IdentityUser> userManager)
        {
            this.userManager = userManager;
        }

        // POST: /api/Auth/Register
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
        {
            var identityUser = new IdentityUser
            {
                UserName = registerRequestDto.Username,
                Email = registerRequestDto.Email // Now it should work
            };

            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDto.Password);

            if (identityResult.Succeeded)
            {
                // Add roles to this User
                if (registerRequestDto.Roles?.Any() == true)
                {
                    foreach (var role in registerRequestDto.Roles)
                    {
                        var roleResult = await userManager.AddToRoleAsync(identityUser, role);
                        if (!roleResult.Succeeded)
                        {
                            return BadRequest($"Failed to add role: {role}");
                        }
                    }
                }
                return Ok("User was registered! Please login.");
            }
            return BadRequest("Something went wrong");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            var user = await userManager.FindByNameAsync(loginDto.Username);
            if (user == null)
                return Unauthorized("Invalid username or password");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result)
                return Unauthorized("Invalid username or password");

            // Generate JWT token here
            return Ok(new { Token = "generated-jwt-token" });
        }
    }
}
