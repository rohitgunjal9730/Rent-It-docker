using System;

namespace RentIt_owner_services.DTOs
{
    public class OwnerBookingDTO
    {
        public int BookingId { get; set; }
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
        public string VehicleNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime BookingDate { get; set; }
        public DateOnly StartingDate { get; set; }
        public DateOnly EndDate { get; set; }
        public TimeOnly? PickupTime { get; set; }
        public TimeOnly? ReturnTime { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? DepositAmount { get; set; }
        public string? BookingStatus { get; set; }
        public string? PaymentStatus { get; set; }
    }
}
