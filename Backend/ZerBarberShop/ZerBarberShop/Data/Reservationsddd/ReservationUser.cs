using ZerBarberShop.Models;
using Microsoft.EntityFrameworkCore;

namespace ZerBarberShop.Data.Reservation
{
    public class ReservationUser : IReservationUser
    {
        private readonly DataContext _context;

        public ReservationUser(DataContext context)
        {
            _context = context;
        }

        public Reservations CreateReservation(Reservations reservation)
        {
            try
            {
                _context.Reservations.Add(reservation);
                _context.SaveChanges();
                return reservation;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("An error occurred while creating the reservation.", ex);
            }
        }

        public Reservations RemoveReservation(Reservations reservation)
        {
            try
            {
                var existingReservation = _context.Reservations.FirstOrDefault(r => r.Id == reservation.Id);
                if (existingReservation == null)
                {
                    throw new KeyNotFoundException("Reservation not found.");
                }

                _context.Reservations.Remove(existingReservation);
                _context.SaveChanges();
                return existingReservation;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("An error occurred while removing the reservation.", ex);
            }
        }

        public Reservations GetReservation(string email)
        {
            try
            {
                var reservation = _context.Reservations.FirstOrDefault(r => r.Email == email);
                if (reservation == null)
                {
                    throw new KeyNotFoundException("No reservation found for this email.");
                }

                return reservation;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("An error occurred while fetching the reservation.", ex);
            }
        }
    }
}
