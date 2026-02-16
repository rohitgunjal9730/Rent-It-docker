using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class Model
{
    public int ModelId { get; set; }

    public string Model1 { get; set; } = null!;

    public int BrandId { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
