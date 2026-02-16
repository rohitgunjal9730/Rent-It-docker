using System;

namespace RentIt_owner_services.DTOs
{
    public class OwnerProfileDTO
    {
        public int UserId { get; set; }
        public string Fname { get; set; }
        public string Mname { get; set; }
        public string Lname { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string DrivingLicenceNo { get; set; }
        public string AdharNo { get; set; }
        public string PanNo { get; set; }
        public string Address { get; set; }
        public int AreaId { get; set; }
        public string AreaName { get; set; }
        public int CityId { get; set; }
        public string CityName { get; set; }
        public string Pincode { get; set; }
        public string ApprovalStatus { get; set; }
    }

    public class UpdateProfileDTO
    {
        public string Phone { get; set; }
        public string Address { get; set; }
        public int AreaId { get; set; }
    }

    public class CityDTO
    {
        public int CityId { get; set; }
        public string CityName { get; set; }
    }

    public class AreaDTO
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }
        public string Pincode { get; set; }
        public int CityId { get; set; }
    }
}
