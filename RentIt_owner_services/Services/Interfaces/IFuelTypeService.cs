using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Services.Interfaces
{
    // Service interface for FuelType business logic
    public interface IFuelTypeService
    {
        // Get all fuel types for dropdown
        Task<List<FuelTypeDto>> GetAllFuelTypes();
    }
}
