using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZerBarberShop.Data;
using ZerBarberShop.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ZerBarberShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailabilityController : Controller
    {
        private readonly DataContext _context;

        public AvailabilityController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailability()
        {
            var availabilities = await _context.Availabilities.ToListAsync();
            return Ok(availabilities);
        }

       
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<IActionResult> CreateAvailableDays([FromBody] List<Availability> availabilityList)
        {
            if (availabilityList == null || !availabilityList.Any())
            {
                return BadRequest("Invalid availability data.");
            }

          
            _context.Availabilities.RemoveRange(_context.Availabilities);
            await _context.SaveChangesAsync();
            
            await _context.Availabilities.AddRangeAsync(availabilityList);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Availability updated successfully!" });
        }
    }
}