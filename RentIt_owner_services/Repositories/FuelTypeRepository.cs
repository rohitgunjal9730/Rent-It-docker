using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;

namespace RentIt_owner_services.Repositories
{
    // Repository implementation for FuelType database operations
    public class FuelTypeRepository : IFuelTypeRepository
    {
        private readonly P20RentitContext _context;

        // Constructor with dependency injection of DbContext
        public FuelTypeRepository(P20RentitContext context)
        {
            _context = context;
        }

        // Get all fuel types from database
        // Returns list of FuelTypeDto for dropdown
        // Note: FuelType is mapped as FuelId and FuelType1 in database
        public async Task<List<FuelTypeDto>> GetAllFuelTypes()
        {
            return await _context.FuelTypes
                .Select(ft => new FuelTypeDto
                {
                    FuelTypeId = ft.FuelId,
                    FuelTypeName = ft.FuelType1
                })
                .ToListAsync();
        }
    }
}
