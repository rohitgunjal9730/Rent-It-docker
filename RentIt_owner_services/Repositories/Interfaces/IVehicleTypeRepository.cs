using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Repositories.Interfaces
{
    // Repository interface for VehicleType operations
    // Handles database queries for vehicle types
    public interface IVehicleTypeRepository
    {
        // Get all vehicle types for dropdown
        Task<List<VehicleTypeDto>> GetAllVehicleTypes();
    }
}
