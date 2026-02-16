using RentIt_admin_services.Models;

namespace RentIt_admin_services.Repositories.Interfaces
{
    public interface IVehicleTypeRepository
    {
        Task<List<VehicleType>> GetAllAsync();
        Task<VehicleType?> GetByIdAsync(int vehicleTypeId);
        Task<bool> ExistsAsync(int vehicleTypeId);
        Task<VehicleType> AddAsync(VehicleType vehicleType);
        Task UpdateAsync(VehicleType vehicleType);
        Task SaveChangesAsync();
    }
}
