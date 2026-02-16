using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Services.Interfaces
{
    // Service interface for VehicleType business logic
    public interface IVehicleTypeService
    {
        // Get all vehicle types for dropdown
        Task<List<VehicleTypeDto>> GetAllVehicleTypes();
    }
}
