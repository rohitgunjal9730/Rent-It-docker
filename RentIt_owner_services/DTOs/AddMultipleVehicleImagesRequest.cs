namespace RentIt_owner_services.DTOs
{
    public class AddMultipleVehicleImagesRequest
    {
        public int VehicleId { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public int PrimaryImageIndex { get; set; } = 0; // Index of primary image (0-based)
    }
}
