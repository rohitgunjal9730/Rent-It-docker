namespace RentIt_owner_services.DTOs
{
    public class VehicleImageDto
    {
        public int VehicleImageId { get; set; }
        public byte[] Image { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
