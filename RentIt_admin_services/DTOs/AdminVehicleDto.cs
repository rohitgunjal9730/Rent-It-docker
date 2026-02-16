namespace RentIt_admin_services.DTOs
{
    public class AdminVehicleDto
    {
        public int VehicleId { get; set; }
        public string OwnerName { get; set; }
        public string? OwnerEmail { get; set; }
        public string? OwnerPhone { get; set; }
        public string VehicleTypeName { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string? FuelTypeName { get; set; }
        public int? Ac { get; set; }
        public string? Status { get; set; }
        public string? VehicleNumber { get; set; }
        public string? VehicleRcNumber { get; set; }
        public string? Description { get; set; }
        public bool IsPrimaryImage { get; set; }
        public byte[]? Image { get; set; }
    }
}
