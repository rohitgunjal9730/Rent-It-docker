using RentIt_owner_services.DTOs;

namespace RentIt_owner_services.Services.Interfaces
{
    // Service interface for Brand business logic
    public interface IBrandService
    {
        // Get all brands for dropdown
        Task<List<BrandDto>> GetAllBrands();
    }
}
