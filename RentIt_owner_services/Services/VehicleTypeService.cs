using RentIt_owner_services.DTOs;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Services
{
    // Service implementation for VehicleType business logic
    // Acts as intermediary between controller and repository
    public class VehicleTypeService : IVehicleTypeService
    {
        private readonly IVehicleTypeRepository _repository;

        // Constructor with dependency injection of repository
        public VehicleTypeService(IVehicleTypeRepository repository)
        {
            _repository = repository;
        }

        // Get all vehicle types - delegates to repository
        // Can add business logic here if needed in future
        public async Task<List<VehicleTypeDto>> GetAllVehicleTypes()
        {
            return await _repository.GetAllVehicleTypes();
        }
    }
}
