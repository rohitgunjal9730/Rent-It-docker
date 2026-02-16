using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class Brand
{
    public int BrandId { get; set; }

    public string? Brand1 { get; set; }

    public virtual ICollection<Model> Models { get; set; } = new List<Model>();
}
