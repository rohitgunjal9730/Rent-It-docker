using Microsoft.EntityFrameworkCore;
using RentIt_admin_services.Models;
using RentIt_admin_services.Repositories.Interfaces;

namespace RentIt_admin_services.Repositories
{
    public class AdminVehicleRepository : IAdminVehicleRepository
    {
        private readonly P20RentitContext _context;

        public AdminVehicleRepository(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<List<Vehicle>> GetAllVehicles()
        {
            return await _context.Vehicles
                .Include(v => v.Owner)
                .Include(v => v.VehicleType)
                .Include(v => v.FuelType)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Brand)
                .Include(v => v.VehicleImages)
                .ToListAsync();
        }

        // Get vehicles that are pending approval (Status == 'PENDING')
        public async Task<List<Vehicle>> GetPendingVehicles()
        {
            return await _context.Vehicles
                .Where(v => v.Status != null && v.Status.ToUpper() == "PENDING")
                .Include(v => v.Owner)
                .Include(v => v.VehicleType)
                .Include(v => v.FuelType)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Brand)
                .Include(v => v.VehicleImages)
                .ToListAsync();
        }

        public async Task<Vehicle?> GetVehicleById(int vehicleId)
        {
            return await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
