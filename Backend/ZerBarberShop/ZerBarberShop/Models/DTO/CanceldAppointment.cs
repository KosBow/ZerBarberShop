﻿namespace ZerBarberShop.Models.DTO;

public class CanceldAppointment
{
    public class CanceledAppointmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Canceled";
    }
}

