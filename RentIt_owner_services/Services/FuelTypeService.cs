using RentIt_owner_services.DTOs;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Services
{
    // Service implementation for FuelType business logic
    // Acts as intermediary between controller and repository
    public class FuelTypeService : IFuelTypeService
    {
        private readonly IFuelTypeRepository _repository;

        // Constructor with dependency injection of repository
        public FuelTypeService(IFuelTypeRepository repository)
        {
            _repository = repository;
        }

        // Get all fuel types - delegates to repository
        // Can add business logic here if needed in future
        public async Task<List<FuelTypeDto>> GetAllFuelTypes()
        {
            return await _repository.GetAllFuelTypes();
        }
    }
}
