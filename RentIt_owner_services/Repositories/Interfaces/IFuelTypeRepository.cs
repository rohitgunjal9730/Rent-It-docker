using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Repositories.Interfaces
{
    // Repository interface for FuelType operations
    // Handles database queries for fuel types
    public interface IFuelTypeRepository
    {
        // Get all fuel types for dropdown
        Task<List<FuelTypeDto>> GetAllFuelTypes();
    }
}
