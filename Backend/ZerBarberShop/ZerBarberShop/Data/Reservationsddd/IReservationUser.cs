using ZerBarberShop.Models;

namespace ZerBarberShop.Data.Reservation;

public interface IReservationUser
{ 
    Reservations CreateReservation(Reservations reservation);
    Reservations RemoveReservation(Reservations reservation);
    Reservations GetReservation(string email);
}