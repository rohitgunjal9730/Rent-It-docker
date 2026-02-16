using System;
using System.Collections.Generic;

namespace RentIt_admin_services.Models;

public partial class User
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string? Fname { get; set; }

    public string? Mname { get; set; }

    public string? Lname { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? DrivingLicenceNo { get; set; }

    public string? AdharNo { get; set; }

    public string? PanNo { get; set; }

    public string? Password { get; set; }

    public string? Address { get; set; }

    public int AreaId { get; set; }

    public int? QuestionId { get; set; }

    public string? Answer { get; set; }

    public RentIt_admin_services.Models.Enums.UserAccountStatus? IsActive { get; set; }

    public RentIt_admin_services.Models.Enums.UserApprovalStatus? ApprovalStatus { get; set; }

    public virtual Area Area { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual SecurityQuestion? Question { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
