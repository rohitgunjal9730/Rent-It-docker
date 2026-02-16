using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class City
{
    public int CityId { get; set; }

    public string? CityName { get; set; }

    public virtual ICollection<Area> Areas { get; set; } = new List<Area>();
}
