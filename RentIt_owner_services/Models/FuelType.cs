using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class FuelType
{
    public int FuelId { get; set; }

    public string? FuelType1 { get; set; }

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
