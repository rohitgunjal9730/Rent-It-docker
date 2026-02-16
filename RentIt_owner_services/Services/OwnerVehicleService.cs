using RentIt_owner_services.Models;
using RentIt_owner_services.Repositories.Interfaces;
using RentIt_owner_services.Services.Interfaces;
using RentIt_owner_services.DTOs;
namespace RentIt_owner_services.Services
{
    public class OwnerVehicleService : IOwnerVehicleService
    {

        private readonly IOwnerVehicleRepository _repository;
        private readonly IBookingService _bookingService;

        public OwnerVehicleService(IOwnerVehicleRepository repository, IBookingService bookingService)
        {
            _repository = repository;
            _bookingService = bookingService;
        }

        public async Task<List<OwnerVehicleDto>> FetchOwnerVehicles(int ownerId)
        {
            var vehicles = await _repository.GetVehiclesByOwnerId(ownerId);

            return vehicles.Select(v =>
            {
                var primaryImage = v.VehicleImages
                    .FirstOrDefault(i => i.IsPrimary == 1);

                return new OwnerVehicleDto
                {
                    VehicleId = v.VehicleId,
                    VehicleTypeName = v.VehicleType.VehicleTypeName,
                    FuelTypeName = v.FuelType != null ? v.FuelType.FuelType1 : null,
                    Ac = v.Ac,
                    Status = v.Status,
                    VehicleNumber = v.VehicleNumber,
                    VehicleRcNumber = v.VehicleRcNumber,
                    Description = v.Description,
                    ModelName = v.Model.Model1,
                    BrandName = v.Model.Brand.Brand1,
                    IsPrimaryImage = primaryImage != null,
                    Image = primaryImage?.Image
                };
            }).ToList();
        }


        public async Task<int> AddVehicle(AddVehicleRequest request, int ownerId)
        {
            var vehicle = new Vehicle
            {
                OwnerId = ownerId,
                VehicleTypeId = request.VehicleTypeId,
                ModelId = request.ModelId,
                FuelTypeId = request.FuelTypeId,
                VehicleNumber = request.VehicleNumber,
                VehicleRcNumber = request.VehicleRcNumber,
                Ac = request.Ac,
                Description = request.Description,
                Status = "ACTIVE"
            };

            await _repository.AddVehicle(vehicle);
            await _repository.SaveChanges();

            return vehicle.VehicleId;
        }

        // Update existing vehicle information
        public async Task UpdateVehicle(int vehicleId, AddVehicleRequest request)
        {
            var vehicle = await _repository.GetVehicleById(vehicleId);
            
            if (vehicle == null)
                throw new Exception("Vehicle not found");

            // Update vehicle properties
            vehicle.VehicleTypeId = request.VehicleTypeId;
            vehicle.ModelId = request.ModelId;
            vehicle.FuelTypeId = request.FuelTypeId;
            vehicle.VehicleNumber = request.VehicleNumber;
            vehicle.VehicleRcNumber = request.VehicleRcNumber;
            vehicle.Ac = request.Ac;
            vehicle.Description = request.Description;

            await _repository.SaveChanges();
        }

        public async Task AddVehicleImage(AddVehicleImageRequest request)
        {
            // 🛡️ 1. Validate file existence
            if (request.Image == null || request.Image.Length == 0)
                throw new Exception("Image file is required");

            // 🛡️ 2. Validate size (max 5 MB)
            if (request.Image.Length > 5 * 1024 * 1024)
                throw new Exception("Image size must be less than 5MB");

            // 🛡️ 3. Validate type
            if (!request.Image.ContentType.StartsWith("image/"))
                throw new Exception("Only image files are allowed");

            byte[] imageBytes;

            // 📦 4. Convert to byte[]
            using (var ms = new MemoryStream())
            {
                await request.Image.CopyToAsync(ms);
                imageBytes = ms.ToArray();
            }

            // ⭐ 5. Handle primary image logic
            if (request.IsPrimary)
                await _repository.ResetPrimaryImages(request.VehicleId);

            // 💾 6. Save entity
            var vehicleImage = new VehicleImage
            {
                VehicleId = request.VehicleId,
                Image = imageBytes,
                IsPrimary = (sbyte)(request.IsPrimary ? 1 : 0)
            };

            await _repository.AddVehicleImage(vehicleImage);
            await _repository.SaveChanges();
        }

        // Add multiple images at once
        public async Task AddMultipleVehicleImages(AddMultipleVehicleImagesRequest request)
        {
            // Validate vehicle exists
            var vehicle = await _repository.GetVehicleById(request.VehicleId);
            if (vehicle == null)
                throw new Exception("Vehicle not found");

            // Validate images
            if (request.Images == null || request.Images.Count == 0)
                throw new Exception("At least one image is required");

            // Validate primary index
            if (request.PrimaryImageIndex < 0 || request.PrimaryImageIndex >= request.Images.Count)
                throw new Exception("Invalid primary image index");

            // Reset existing primary images if setting a new primary
            await _repository.ResetPrimaryImages(request.VehicleId);

            // Process each image
            for (int i = 0; i < request.Images.Count; i++)
            {
                var imageFile = request.Images[i];

                // Validate file
                if (imageFile == null || imageFile.Length == 0)
                    continue;

                // Validate size (max 5 MB)
                if (imageFile.Length > 5 * 1024 * 1024)
                    throw new Exception($"Image {i + 1} size must be less than 5MB");

                // Validate type
                if (!imageFile.ContentType.StartsWith("image/"))
                    throw new Exception($"File {i + 1} is not a valid image");

                byte[] imageBytes;

                // Convert to byte[]
                using (var ms = new MemoryStream())
                {
                    await imageFile.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                }

                // Create vehicle image entity
                var vehicleImage = new VehicleImage
                {
                    VehicleId = request.VehicleId,
                    Image = imageBytes,
                    IsPrimary = (sbyte)(i == request.PrimaryImageIndex ? 1 : 0),
                    CreatedAt = DateTime.Now
                };

                await _repository.AddVehicleImage(vehicleImage);
            }

            await _repository.SaveChanges();
        }

        // Update vehicle description only
        public async Task UpdateVehicleDescription(int vehicleId, UpdateVehicleDescriptionRequest request)
        {
            var vehicle = await _repository.GetVehicleById(vehicleId);

            if (vehicle == null)
                throw new Exception("Vehicle not found");

            vehicle.Description = request.Description;

            await _repository.SaveChanges();
        }

        // Get vehicle details for edit page
        public async Task<VehicleDetailsDto> GetVehicleDetails(int vehicleId)
        {
            var vehicle = await _repository.GetVehicleByIdWithImages(vehicleId);

            if (vehicle == null)
                throw new Exception("Vehicle not found");

            return new VehicleDetailsDto
            {
                VehicleId = vehicle.VehicleId,
                VehicleTypeId = vehicle.VehicleTypeId,
                VehicleTypeName = vehicle.VehicleType?.VehicleTypeName,
                ModelId = vehicle.ModelId,
                ModelName = vehicle.Model?.Model1,
                BrandId = vehicle.Model?.BrandId ?? 0,
                BrandName = vehicle.Model?.Brand?.Brand1,
                FuelTypeId = vehicle.FuelTypeId,
                FuelTypeName = vehicle.FuelType?.FuelType1,
                Ac = vehicle.Ac,
                Status = vehicle.Status,
                VehicleNumber = vehicle.VehicleNumber,
                VehicleRcNumber = vehicle.VehicleRcNumber,
                Description = vehicle.Description,
                Images = vehicle.VehicleImages.Select(img => new VehicleImageDto
                {
                    VehicleImageId = img.VehicleImageId,
                    Image = img.Image,
                    IsPrimary = img.IsPrimary == 1,
                    CreatedAt = img.CreatedAt
                }).ToList()
            };
        }

        // Delete vehicle
        public async Task DeleteVehicle(int vehicleId)
        {
            if (await _bookingService.HasActiveBookings(vehicleId))
                throw new InvalidOperationException("Vehicle cannot be deleted because it has active bookings");

            var vehicle = await _repository.GetVehicleById(vehicleId);

            if (vehicle == null)
                throw new Exception("Vehicle not found");

            await _repository.DeleteVehicle(vehicle);
            await _repository.SaveChanges();
        }

        // Delete single image
        public async Task DeleteVehicleImage(int imageId)
        {
            var image = await _repository.GetVehicleImageById(imageId);

            if (image == null)
                throw new Exception("Image not found");

            // Check if this is the only image
            var vehicle = await _repository.GetVehicleByIdWithImages(image.VehicleId);
            if (vehicle != null && vehicle.VehicleImages.Count == 1)
                throw new Exception("Cannot delete the last image. Vehicle must have at least one image.");

            // If deleting primary image, set another image as primary
            if (image.IsPrimary == 1)
            {
                var otherImage = vehicle.VehicleImages.FirstOrDefault(i => i.VehicleImageId != imageId);
                if (otherImage != null)
                {
                    otherImage.IsPrimary = 1;
                }
            }

            await _repository.DeleteVehicleImage(image);
            await _repository.SaveChanges();
        }

        // Set primary image
        public async Task SetPrimaryImage(UpdatePrimaryImageRequest request)
        {
            // Validate image exists and belongs to the vehicle
            var image = await _repository.GetVehicleImageById(request.VehicleImageId);

            if (image == null)
                throw new Exception("Image not found");

            if (image.VehicleId != request.VehicleId)
                throw new Exception("Image does not belong to this vehicle");

            await _repository.SetPrimaryImage(request.VehicleId, request.VehicleImageId);
            await _repository.SaveChanges();
        }

    }
}
