using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Repositories.Interfaces
{
    // Repository interface for Brand operations
    // Handles database queries for vehicle brands
    public interface IBrandRepository
    {
        // Get all brands for dropdown
        Task<List<BrandDto>> GetAllBrands();
    }
}
