using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;

namespace RentIt_owner_services.Repositories
{
    // Repository implementation for Brand database operations
    public class BrandRepository : IBrandRepository
    {
        private readonly P20RentitContext _context;

        // Constructor with dependency injection of DbContext
        public BrandRepository(P20RentitContext context)
        {
            _context = context;
        }

        // Get all brands from database
        // Returns list of BrandDto for dropdown
        // Note: Brand name is stored in Brand1 field in database
        public async Task<List<BrandDto>> GetAllBrands()
        {
            return await _context.Brands
                .Select(b => new BrandDto
                {
                    BrandId = b.BrandId,
                    BrandName = b.Brand1
                })
                .ToListAsync();
        }
    }
}
