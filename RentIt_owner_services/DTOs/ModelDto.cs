namespace RentIt_owner_services.DTOs
{
    // DTO for returning Model data to frontend
    // Used in dependent dropdown selection based on selected brand
    public class ModelDto
    {
        public int ModelId { get; set; }
        public string? ModelName { get; set; }
        public int BrandId { get; set; }
    }
}
