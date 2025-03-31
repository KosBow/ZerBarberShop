using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZerBarberShop.Data;
using ZerBarberShop.Data.Reservation;
using ZerBarberShop.Models;
using ZerBarberShop.Models.DTO;

namespace ZerBarberShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : Controller
    {
        private readonly DataContext _context;
        private readonly IReservationUser _reservationUser;

        public ReservationController(DataContext context, IReservationUser reservationUser)
        {
            _context = context;
            _reservationUser = reservationUser;
        }
        [Authorize]
        [HttpPost]
        public IActionResult CreateReservation(ReservationDTO reservationDto)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Invalid token. Email not found." });
                }

                var existingUser = _context.Users.FirstOrDefault(u => u.Email == userEmail);
                if (existingUser == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var existingReservation = _context.Reservations.FirstOrDefault(r => r.UserId == existingUser.Id);
                if (existingReservation != null)
                {
                    return BadRequest(new { message = "Reservation already exists" });
                }

                var newReservation = new Reservations
                {
                    UserId = existingUser.Id,
                    Email = existingUser.Email,
                    Username = existingUser.UserName, 
                    Date = reservationDto.Date,
                    isPending = true,
                    isAccepted = false,
                };

                _context.Reservations.Add(newReservation);
                _context.SaveChanges();

                return Ok(new { message = "Reservation created successfully", reservation = newReservation });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }

        [Authorize]
        [HttpGet("user")]
        public IActionResult ShowUserReservation()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
    
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized(new { message = "Invalid token. Email not found." });
            }

            var userReservation = _context.Reservations.Where(e => e.Email == userEmail).ToList();

            if (!userReservation.Any())
            {
                return NotFound(new { message = "User reservation not found" });
            }

            return Ok(userReservation);
        }
        
        


        
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet]
        public IActionResult GetAllReservations()
        {
            var allReservations = _context.Reservations.ToList();
            var orderedReservations = allReservations
                .OrderBy(r => r.Date)
                .ThenBy(r => r.Username);
            if (!allReservations.Any()) 
            {
                return NotFound(new { message = "No reservations found for this email" });
            }

            return Ok(orderedReservations);
        }


        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult DeleteReservation(int id)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return Unauthorized(new { message = "Invalid token. Email not found." });
                }

                var existingReservation = _context.Reservations.FirstOrDefault(r => r.Id == id);
                if (existingReservation == null)
                {
                    return NotFound(new { message = "Reservation not found" });
                }

     
                var isAdmin = User.IsInRole("Admin");

                if (isAdmin)
                {
            
                    _context.Reservations.Remove(existingReservation);
                }
                else
                {
                 
                    if (existingReservation.isAccepted)
                    {
                        return Forbid();
                    }

                    _context.Reservations.Remove(existingReservation);
                }

                _context.SaveChanges();
                return Ok(new { message = "Reservation deleted successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }

        
        [HttpPatch("{id}/accept")]
        public async Task<IActionResult> AcceptAppointment(int id)
        {
            var appointment = await _context.Reservations.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.isPending = false;
            appointment.isAccepted = true;
    
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment accepted" });
        }

        
        [Authorize(Policy = "AdminPolicy")]
        [HttpPatch("{id}/cancel")]
        public IActionResult CancelReservation(int id)
        {
            try
            {
                var existingReservation = _context.Reservations.FirstOrDefault(r => r.Id == id);
                if (existingReservation == null)
                {
                    return NotFound(new { message = "Reservation not found" });
                }

         
                if (existingReservation.isAccepted)
                {
                    existingReservation.isAccepted = false;
                    existingReservation.isPending = false; 
                    
                    _context.SaveChanges();
                    return Ok(new { message = "Reservation cancelled successfully." });
                }
        
        
                _context.Reservations.Remove(existingReservation);
                _context.SaveChanges();
                return Ok(new { message = "Reservation deleted successfully." });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }



        
    }
    
}
