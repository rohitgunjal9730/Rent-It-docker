using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Repositories.Interfaces
{
    // Repository interface for Model operations
    // Handles database queries for vehicle models
    public interface IModelRepository
    {
        // Get all models for a specific brand (dependent dropdown)
        Task<List<ModelDto>> GetModelsByBrandId(int brandId);
    }
}
