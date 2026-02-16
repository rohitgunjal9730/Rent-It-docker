using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class VehicleImage
{
    public int VehicleImageId { get; set; }

    public int VehicleId { get; set; }

    public byte[]? Image { get; set; }

    public sbyte? IsPrimary { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Vehicle Vehicle { get; set; } = null!;
}
