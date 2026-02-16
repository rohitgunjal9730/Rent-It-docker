namespace RentIt_owner_services.DTOs
{
    // DTO for returning VehicleType data to frontend
    // Used in dropdown selection for vehicle types
    public class VehicleTypeDto
    {
        public int VehicleTypeId { get; set; }
        public string? VehicleTypeName { get; set; }
    }
}
