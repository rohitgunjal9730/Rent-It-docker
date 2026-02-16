using Microsoft.EntityFrameworkCore;
using RentIt_admin_services.Models;
using RentIt_admin_services.Repositories.Interfaces;

namespace RentIt_admin_services.Repositories
{
    public class VehicleTypeRepository : IVehicleTypeRepository
    {
        private readonly P20RentitContext _context;

        public VehicleTypeRepository(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<List<VehicleType>> GetAllAsync()
        {
            return await _context.VehicleTypes.ToListAsync();
        }

        public async Task<VehicleType?> GetByIdAsync(int vehicleTypeId)
        {
            return await _context.VehicleTypes
                .FirstOrDefaultAsync(vt => vt.VehicleTypeId == vehicleTypeId);
        }

        public async Task<bool> ExistsAsync(int vehicleTypeId)
        {
            return await _context.VehicleTypes
                .AnyAsync(vt => vt.VehicleTypeId == vehicleTypeId);
        }

        public async Task<VehicleType> AddAsync(VehicleType vehicleType)
        {
            await _context.VehicleTypes.AddAsync(vehicleType);
            return vehicleType;
        }

        public Task UpdateAsync(VehicleType vehicleType)
        {
            _context.VehicleTypes.Update(vehicleType);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
