using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;

namespace RentIt_owner_services.Repositories
{
    // Repository implementation for Model database operations
    public class ModelRepository : IModelRepository
    {
        private readonly P20RentitContext _context;

        // Constructor with dependency injection of DbContext
        public ModelRepository(P20RentitContext context)
        {
            _context = context;
        }

        // Get all models for a specific brand (for dependent dropdown)
        // Filters models by brandId parameter
        // Note: Model name is stored in Model1 field in database
        public async Task<List<ModelDto>> GetModelsByBrandId(int brandId)
        {
            return await _context.Models
                .Where(m => m.BrandId == brandId)
                .Select(m => new ModelDto
                {
                    ModelId = m.ModelId,
                    ModelName = m.Model1,
                    BrandId = m.BrandId
                })
                .ToListAsync();
        }
    }
}
