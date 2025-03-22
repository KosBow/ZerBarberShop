using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZerBarberShop.Models;
using ZerBarberShop.Models.DTO;
using ZerBarberShop.Services.Jwt;
using ZerBarberShop.Services.Security;
using ZerBarberShop.Services.Users;

namespace tuc_backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : Controller
{
    private readonly IJWTServices _jwtServices;
    private readonly IUserServices _userService;
    private readonly PasswordManager _passwordManager;

    public AuthController(IJWTServices jwtServices, IUserServices userService, PasswordManager passwordManager)
    {
        _jwtServices = jwtServices;
        _userService = userService;
        _passwordManager = passwordManager;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Login login)
    {
        var user = _userService.GetByEmail(login.Email);
        if (user == null || !_passwordManager.VerifyPassword(user.Password, login.Password))
        {
            return BadRequest("Invalid credentials.");
        }
        var jwtToken = _jwtServices.GenerateToken(user);
        var refreshToken = _jwtServices.RefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _userService.UpdateUser(user);

        Response.Cookies.Append("token", jwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
        });

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });
        return Ok(new { message = "Login successful!", jwtToken, refreshToken });
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] Register register)
    {
        if (!register.PasswordsMatch)
        {
            return BadRequest("Passwords do not match.");
        }

        var existingUser = _userService.GetByEmail(register.Email);
        if (existingUser != null)
        {
            return BadRequest("Email is already registered.");
        }

        var hashedPassword = _passwordManager.HashPassword(register.Password);
        var defaultRole = _userService.GetRoleByName("User");

        if (defaultRole == null)
        {
            return BadRequest("Default role not configured.");
        }

        var newUser = new IdentityUsers
        {
            Email = register.Email,
            Password = hashedPassword,
            UserName = register.Email,
            IsEmailConfirmed = false,
            RoleId = defaultRole.RoleId,
            RefreshToken = _jwtServices.RefreshToken(),
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(7),
            Role = defaultRole
        };

        _userService.CreateUser(newUser);

        var jwtToken = _jwtServices.GenerateToken(newUser);
        var refreshToken = _jwtServices.RefreshToken();

        newUser.RefreshToken = refreshToken;
        newUser.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _userService.UpdateUser(newUser);

        Response.Cookies.Append("token", jwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
        });
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        return Ok(new { message = "Registration successful!", jwtToken, refreshToken });
    }

    [HttpPost("refresh-token")]
    public IActionResult RefreshToken([FromBody] string refreshToken)
    {
        var user = _userService.GetByRefreshToken(refreshToken);
        if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        var newJwtToken = _jwtServices.GenerateToken(user);
        var newRefreshToken = _jwtServices.RefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _userService.UpdateUser(user);

        Response.Cookies.Append("token", newJwtToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
        });

        Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        return Ok(new { jwtToken = newJwtToken, refreshToken = newRefreshToken });
    }

    [HttpPost("Logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        Response.Cookies.Delete("refreshToken");

        var response = new LogoutResponse
        {
            Message = "Successfully logged out."
        };

        return Ok(response);
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword()
    {
        return Ok("Password reset successful");
    }

    [HttpPost("forgot-password")]
    public IActionResult ForgotPassword()
    {
        return Ok("Forgot password");
    }


    [Authorize(Roles = "User")]
    [HttpGet("user-only")]
    public IActionResult UserOnlyEndpoint()
    {
        return Ok("Welcome User!");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public IActionResult AdminOnlyEndpoint()
    {
        return Ok("Welcome Admin!");
    }
}