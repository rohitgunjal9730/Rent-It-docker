using RentIt_admin_services.Models;

namespace RentIt_admin_services.Repositories.Interfaces
{
    public interface IAdminVehicleRepository
    {
        Task<List<Vehicle>> GetAllVehicles();
        // Get vehicles pending approval
        Task<List<Vehicle>> GetPendingVehicles();
        Task<Vehicle?> GetVehicleById(int vehicleId);
        Task SaveChanges();
    }
}
