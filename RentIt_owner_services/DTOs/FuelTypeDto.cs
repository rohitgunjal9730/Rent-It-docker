namespace RentIt_owner_services.DTOs
{
    // DTO for returning FuelType data to frontend
    // Used in dropdown selection for fuel types
    public class FuelTypeDto
    {
        public int FuelTypeId { get; set; }
        public string? FuelTypeName { get; set; }
    }
}
