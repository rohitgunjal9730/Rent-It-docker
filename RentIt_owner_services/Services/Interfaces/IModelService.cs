using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Services.Interfaces
{
    // Service interface for Model business logic
    public interface IModelService
    {
        // Get models filtered by brand ID (for dependent dropdown)
        Task<List<ModelDto>> GetModelsByBrandId(int brandId);
    }
}
