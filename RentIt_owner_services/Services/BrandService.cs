using RentIt_owner_services.DTOs;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Services
{
    // Service implementation for Brand business logic
    // Acts as intermediary between controller and repository
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _repository;

        // Constructor with dependency injection of repository
        public BrandService(IBrandRepository repository)
        {
            _repository = repository;
        }

        // Get all brands - delegates to repository
        // Can add business logic here if needed in future
        public async Task<List<BrandDto>> GetAllBrands()
        {
            return await _repository.GetAllBrands();
        }
    }
}
