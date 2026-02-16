namespace RentIt_owner_services.DTOs
{
    public class VehicleDetailsDto
    {
        public int VehicleId { get; set; }
        public int VehicleTypeId { get; set; }
        public string VehicleTypeName { get; set; }
        public int ModelId { get; set; }
        public string ModelName { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public int? FuelTypeId { get; set; }
        public string FuelTypeName { get; set; }
        public int? Ac { get; set; }
        public string Status { get; set; }
        public string VehicleNumber { get; set; }
        public string VehicleRcNumber { get; set; }
        public string Description { get; set; }
        public List<VehicleImageDto> Images { get; set; } = new List<VehicleImageDto>();
    }
}
