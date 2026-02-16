namespace RentIt_admin_services.DTOs
{
    public class EditVehicleTypeRequest
    {
        public int VehicleTypeId { get; set; }
        public string VehicleTypeName { get; set; } = string.Empty;
        public double Rate { get; set; }
        public double Deposite { get; set; }
        public string PriceUnit { get; set; } = string.Empty;
    }
}
