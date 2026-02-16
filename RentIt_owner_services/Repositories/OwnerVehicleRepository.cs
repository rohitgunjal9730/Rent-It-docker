using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;

namespace RentIt_owner_services.Repositories
{
    public class OwnerVehicleRepository : IOwnerVehicleRepository
    {


        private readonly P20RentitContext _context;

        public OwnerVehicleRepository(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<List<Vehicle>> GetVehiclesByOwnerId(int ownerId)
        {
            return await _context.Vehicles
                .Where(v => v.OwnerId == ownerId && v.Status != "MAINTENANCE")
                .Include(v => v.VehicleType)
                .Include(v => v.FuelType)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Brand)
                .Include(v => v.VehicleImages)
                .ToListAsync();
        }

        // Get single vehicle by ID for update operations
        public async Task<Vehicle?> GetVehicleById(int vehicleId)
        {
            return await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId && v.Status != "MAINTENANCE");
        }

        // Add a new vehicle
        public async Task AddVehicle(Vehicle vehicle)
        {
            // Ensure status is ACTIVE by default if not set
            if (string.IsNullOrEmpty(vehicle.Status))
            {
                vehicle.Status = "ACTIVE";
            }
            await _context.Vehicles.AddAsync(vehicle);
        }


        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }


        // add image
        public async Task AddVehicleImage(VehicleImage image)
        {
            await _context.VehicleImages.AddAsync(image);
        }

        public async Task ResetPrimaryImages(int vehicleId)
        {
            var images = await _context.VehicleImages
                .Where(i => i.VehicleId == vehicleId)
                .ToListAsync();

            foreach (var img in images)
                img.IsPrimary = 0;
        }

        // Get vehicle by ID with all related data for edit page
        public async Task<Vehicle?> GetVehicleByIdWithImages(int vehicleId)
        {
            return await _context.Vehicles
                .Include(v => v.VehicleType)
                .Include(v => v.FuelType)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Brand)
                .Include(v => v.VehicleImages)
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId && v.Status != "MAINTENANCE");
        }

        // Delete vehicle (Soft delete to allow keeping booking history)
        public async Task DeleteVehicle(Vehicle vehicle)
        {
            // Instead of physical delete, marks as MAINTENANCE (soft delete) due to Enum constraint
            //vehicle.Status = "MAINTENANCE";

            // Get all related vehicle images
            var images = await _context.VehicleImages
                                .Where(v => v.VehicleId == vehicle.VehicleId)
                                .ToListAsync();

            // Remove images first
            _context.VehicleImages.RemoveRange(images);

            _context.Vehicles.Remove(vehicle); // Removed physical delete

            await _context.SaveChangesAsync();
        }

        // Get image by ID
        public async Task<VehicleImage?> GetVehicleImageById(int imageId)
        {
            return await _context.VehicleImages
                .FirstOrDefaultAsync(i => i.VehicleImageId == imageId);
        }

        // Delete single image
        public async Task DeleteVehicleImage(VehicleImage image)
        {
            _context.VehicleImages.Remove(image);
        }

        // Set specific image as primary
        public async Task SetPrimaryImage(int vehicleId, int imageId)
        {
            // Reset all images for this vehicle
            await ResetPrimaryImages(vehicleId);

            // Set the specified image as primary
            var image = await _context.VehicleImages
                .FirstOrDefaultAsync(i => i.VehicleImageId == imageId && i.VehicleId == vehicleId);

            if (image != null)
            {
                image.IsPrimary = 1;
            }
        }

    }
}
