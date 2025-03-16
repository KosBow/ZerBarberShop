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

        [HttpPost]
        public IActionResult CreateReservation(ReservationDTO reservationDto)
        {
            try
            {
                var existingUser = _context.Users.FirstOrDefault(u => u.Id == reservationDto.UserId);
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

        [HttpDelete("{id}")]
        public IActionResult DeleteReservation(int id)
        {
            try
            {
                var existingReservation = _context.Reservations.FirstOrDefault(r => r.Id == id);
                if (existingReservation == null)
                {
                    return NotFound(new { message = "Reservation not found" });
                }

                _context.Reservations.Remove(existingReservation);
                _context.SaveChanges();
                return Ok(new { message = "Reservation deleted successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
    }
}