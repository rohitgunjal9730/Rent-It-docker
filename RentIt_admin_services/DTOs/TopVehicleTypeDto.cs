namespace RentIt_admin_services.DTOs
{
    public class TopVehicleTypeDto
    {
        public string VehicleTypeName { get; set; } = string.Empty;
        public int BookingsCount { get; set; }
    }
}
