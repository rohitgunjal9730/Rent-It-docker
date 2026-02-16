using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class VehicleType
{
    public int VehicleTypeId { get; set; }

    public string? VehicleTypeName { get; set; }

    public double? Rate { get; set; }

    public double? Deposit { get; set; }

    public string? PriceUnit { get; set; }

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
