using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int VehicleId { get; set; }

    public DateTime BookingDate { get; set; }

    public DateOnly StartingDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? PaymentStatus { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? BookingStatus { get; set; }

    public decimal? PaidAmount { get; set; }

    public virtual ICollection<BookingRecord> BookingRecords { get; set; } = new List<BookingRecord>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User User { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}
