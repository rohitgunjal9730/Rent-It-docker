using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class Vehicle
{
    public int VehicleId { get; set; }

    public int OwnerId { get; set; }

    public int VehicleTypeId { get; set; }

    public int? FuelTypeId { get; set; }

    public int? Ac { get; set; }

    public string? Status { get; set; }

    public string? VehicleNumber { get; set; }

    public string? VehicleRcNumber { get; set; }

    public string? Description { get; set; }

    public int ModelId { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual FuelType? FuelType { get; set; }

    public virtual Model Model { get; set; } = null!;

    public virtual User Owner { get; set; } = null!;

    public virtual ICollection<VehicleImage> VehicleImages { get; set; } = new List<VehicleImage>();

    public virtual VehicleType VehicleType { get; set; } = null!;
}
