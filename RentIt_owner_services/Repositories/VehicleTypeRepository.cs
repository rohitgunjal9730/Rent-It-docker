using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;

namespace RentIt_owner_services.Repositories
{
    // Repository implementation for VehicleType database operations
    public class VehicleTypeRepository : IVehicleTypeRepository
    {
        private readonly P20RentitContext _context;

        // Constructor with dependency injection of DbContext
        public VehicleTypeRepository(P20RentitContext context)
        {
            _context = context;
        }

        // Get all vehicle types from database
        // Returns list of VehicleTypeDto for dropdown
        public async Task<List<VehicleTypeDto>> GetAllVehicleTypes()
        {
            return await _context.VehicleTypes
                .Select(vt => new VehicleTypeDto
                {
                    VehicleTypeId = vt.VehicleTypeId,
                    VehicleTypeName = vt.VehicleTypeName
                })
                .ToListAsync();
        }
    }
}
