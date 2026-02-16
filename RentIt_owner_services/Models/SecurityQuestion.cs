using System;
using System.Collections.Generic;

namespace RentIt_owner_services.Models;

public partial class SecurityQuestion
{
    public int QuestionId { get; set; }

    public string? Question { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
