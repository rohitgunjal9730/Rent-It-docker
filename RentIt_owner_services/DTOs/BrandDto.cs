namespace RentIt_owner_services.DTOs
{
    // DTO for returning Brand data to frontend
    // Used in dropdown selection for vehicle brands
    public class BrandDto
    {
        public int BrandId { get; set; }
        public string? BrandName { get; set; }
    }
}
