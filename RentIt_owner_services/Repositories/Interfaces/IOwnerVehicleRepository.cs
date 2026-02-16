using RentIt_owner_services.Models;

namespace RentIt_owner_services.Repositories.Interfaces
{
    public interface IOwnerVehicleRepository
    {
        Task<List<Vehicle>> GetVehiclesByOwnerId(int ownerId);

        // Get single vehicle by ID for update
        Task<Vehicle?> GetVehicleById(int vehicleId);

        // Get vehicle by ID with all related data (images, type, model, brand, fuel type)
        Task<Vehicle?> GetVehicleByIdWithImages(int vehicleId);

        // add vehicle
        Task AddVehicle(Vehicle vehicle);

        // Delete vehicle
        Task DeleteVehicle(Vehicle vehicle);

        Task SaveChanges();

        // add image
        Task AddVehicleImage(VehicleImage image);
        Task ResetPrimaryImages(int vehicleId);

        // Get image by ID
        Task<VehicleImage?> GetVehicleImageById(int imageId);

        // Delete image
        Task DeleteVehicleImage(VehicleImage image);

        // Set specific image as primary
        Task SetPrimaryImage(int vehicleId, int imageId);

    }
}
