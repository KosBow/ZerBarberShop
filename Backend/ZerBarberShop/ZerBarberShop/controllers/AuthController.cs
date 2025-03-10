using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using ZerBarberShop.Data;
using ZerBarberShop.Models;
using ZerBarberShop.Models.DTO;

namespace ZerBarberShop.controllers;


[Route("api")]
[ApiController]
public class AuthController : Controller
{
    private readonly IUserRepository _repository;
    // private readonly JwtService _jwtService;

    public AuthController(IUserRepository repository)
    {
        _repository = repository;
    }

    [HttpPost("register")]
    public IActionResult Register(Register register)
    {
        var user = new Users
        {
            Username = register.Name,
            Email = register.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(register.Password)
        };

        return Created("success", _repository.Create(user));
    }

    [HttpPost("login")]
    public IActionResult Login(Login login)
    {
        var user = _repository.GetByEmail(login.Email);

        if (user == null) return BadRequest(new { message = "Invalid Credentials" });

        if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
        {
            return BadRequest(new { message = "Invalid Credentials" });
        }

        return Ok(new
        {
            message = "success"
        });
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");

        return Ok(new
        {
            message = "success"
        });
    }
}