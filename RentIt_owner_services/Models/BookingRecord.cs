using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class BookingRecord
{
    public int RecordId { get; set; }

    public int BookingId { get; set; }

    public string VehicleStatus { get; set; } = null!;

    public DateTime? ActionDatetime { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
