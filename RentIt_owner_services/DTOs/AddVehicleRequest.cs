namespace RentIt_owner_services.DTOs
{
    public class AddVehicleRequest
    {
        public int VehicleTypeId { get; set; }
        public int ModelId { get; set; }
        public int FuelTypeId { get; set; }
        public string VehicleNumber { get; set; }
        public string VehicleRcNumber { get; set; }
        public int Ac { get; set; }
        public string? Description { get; set; }
    }
}
