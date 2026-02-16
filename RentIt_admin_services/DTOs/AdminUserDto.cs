namespace RentIt_admin_services.DTOs
{
    public class AdminUserDto
    {
        public int UserId { get; set; }
        public string RoleName { get; set; }
        public string? Fname { get; set; }
        public string? Mname { get; set; }
        public string? Lname { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? DrivingLicenceNo { get; set; }
        public string? AdharNo { get; set; }
        public string? PanNo { get; set; }
        public string? Address { get; set; }
        public string? AreaName { get; set; }
        public string? CityName { get; set; }
        public string? ApprovalStatus { get; set; }
        public string? IsActive { get; set; }
    }
}
