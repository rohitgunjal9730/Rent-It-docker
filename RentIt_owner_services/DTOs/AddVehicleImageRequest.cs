namespace RentIt_owner_services.DTOs
{
    public class AddVehicleImageRequest
    {
        public int VehicleId { get; set; }
        public bool IsPrimary { get; set; }
        public IFormFile Image { get; set; } = null!;
    }
}
