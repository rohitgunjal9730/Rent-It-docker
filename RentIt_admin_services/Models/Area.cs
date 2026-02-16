using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class Area
{
    public int AreaId { get; set; }

    public string? AreaName { get; set; }

    public int CityId { get; set; }

    public string? Pincode { get; set; }

    public virtual City City { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
