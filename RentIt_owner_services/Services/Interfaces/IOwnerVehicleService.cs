using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using System.Runtime.CompilerServices;

namespace RentIt_owner_services.Services.Interfaces
{
    public interface IOwnerVehicleService
    {

        Task<List<OwnerVehicleDto>> FetchOwnerVehicles(int ownerId);

        Task<int> AddVehicle(AddVehicleRequest request, int ownerId);

        // Update existing vehicle
        Task UpdateVehicle(int vehicleId, AddVehicleRequest request);

        // Update vehicle description only (for edit)
        Task UpdateVehicleDescription(int vehicleId, UpdateVehicleDescriptionRequest request);

        Task AddVehicleImage(AddVehicleImageRequest request);

        // Add multiple images at once
        Task AddMultipleVehicleImages(AddMultipleVehicleImagesRequest request);

        // Get vehicle details for edit page
        Task<VehicleDetailsDto> GetVehicleDetails(int vehicleId);

        // Delete vehicle
        Task DeleteVehicle(int vehicleId);

        // Delete single image
        Task DeleteVehicleImage(int imageId);

        // Set primary image
        Task SetPrimaryImage(UpdatePrimaryImageRequest request);

    }
}
