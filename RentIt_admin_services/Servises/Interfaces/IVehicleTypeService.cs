using RentIt_admin_services.DTOs;

namespace RentIt_admin_services.Servises.Interfaces
{
    public interface IVehicleTypeService
    {
        Task<List<VehicleTypeResponse>> GetAllVehicleTypesAsync();
        Task<VehicleTypeResponse> GetVehicleTypeByIdAsync(int vehicleTypeId);
        Task<VehicleTypeResponse> AddVehicleTypeAsync(AddVehicleTypeRequest request);
        Task<VehicleTypeResponse> EditVehicleTypeAsync(EditVehicleTypeRequest request);
    }
}
