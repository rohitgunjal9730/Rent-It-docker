using RentIt_admin_services.DTOs;

namespace RentIt_admin_services.Servises.Interfaces
{
    public interface IAdminVehicleService
    {
        Task<List<AdminVehicleDto>> GetAllVehicles();        Task<List<DTOs.PendingVehicleDto>> GetPendingVehicles();
        Task ApproveVehicle(int vehicleId);
        Task RejectVehicle(int vehicleId, string? reason = null);        Task BlockVehicle(int vehicleId);
        Task UnblockVehicle(int vehicleId);
        Task UpdateVehicleStatus(int vehicleId, string status);
    }
}
