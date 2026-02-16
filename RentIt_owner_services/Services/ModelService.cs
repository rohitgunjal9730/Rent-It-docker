using RentIt_owner_services.DTOs;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Services
{
    // Service implementation for Model business logic
    // Acts as intermediary between controller and repository
    public class ModelService : IModelService
    {
        private readonly IModelRepository _repository;

        // Constructor with dependency injection of repository
        public ModelService(IModelRepository repository)
        {
            _repository = repository;
        }

        // Get models by brand ID - delegates to repository
        // Used for dependent dropdown where models depend on selected brand
        public async Task<List<ModelDto>> GetModelsByBrandId(int brandId)
        {
            return await _repository.GetModelsByBrandId(brandId);
        }
    }
}
