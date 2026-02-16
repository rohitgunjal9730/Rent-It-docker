namespace RentIt_admin_services.DTOs
{
    public class PendingVehicleDto
    {
        public int VehicleId { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerEmail { get; set; } = string.Empty;
        public string VehicleNumber { get; set; } = string.Empty;
        public string? VehicleRcNumber { get; set; }
        public string? Description { get; set; }
        public string? VehicleTypeName { get; set; }
        public string? BrandName { get; set; }
        public string? ModelName { get; set; }
        public string? FuelTypeName { get; set; }
        public string? ImageBase64 { get; set; }
    }
}
