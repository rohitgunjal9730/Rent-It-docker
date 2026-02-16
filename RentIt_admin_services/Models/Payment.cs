using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal PaymentAmount { get; set; }

    public string? PaymentStatus { get; set; }

    public string TransactionId { get; set; } = null!;

    public DateTime? PaymentDate { get; set; }

    public string? PaymentType { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
