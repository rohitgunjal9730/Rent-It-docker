using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    [ApiController]
    [Route("owner/vehicles")]
    public class OwnerVehicleController : Controller
    {
        private readonly IOwnerVehicleService _ownerVehicleService;

        public OwnerVehicleController(IOwnerVehicleService ownerVehicleService)
        {
            _ownerVehicleService = ownerVehicleService;
        }

        // GET: api/owner/vehicles/{ownerId}
        [HttpGet("{ownerId}")]
        public async Task<IActionResult> FetchOwnerVehicles(int ownerId)
        {
            var result = await _ownerVehicleService.FetchOwnerVehicles(ownerId);
            return Ok(result);
        }

        // POST: api/owner/vehicles/{ownerId}
        [HttpPost("{ownerId}")]
        public async Task<IActionResult> AddVehicle(
            int ownerId,
            [FromBody] AddVehicleRequest request)
        {
            var vehicleId = await _ownerVehicleService.AddVehicle(request, ownerId);

            return Ok(new
            {
                message = "Vehicle added successfully",
                vehicleId
            });
        }

        // PUT: api/owner/vehicles/{vehicleId}
        // Update existing vehicle information
        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> UpdateVehicle(
            int vehicleId,
            [FromBody] AddVehicleRequest request)
        {
            // Note: Reusing AddVehicleRequest DTO for update
            // You can create a separate UpdateVehicleRequest if different fields needed
            await _ownerVehicleService.UpdateVehicle(vehicleId, request);

            return Ok(new
            {
                message = "Vehicle updated successfully"
            });
        }

        // POST: api/owner/vehicles/upload-image
        // Upload vehicle image (primary or additional)
        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadVehicleImage(
            [FromForm] AddVehicleImageRequest request)
        {
            await _ownerVehicleService.AddVehicleImage(request);

            return Ok(new
            {
                message = "Vehicle image uploaded successfully"
            });
        }

        // POST: api/owner/vehicles/{vehicleId}/images/multiple
        // Upload multiple images for a vehicle
        [HttpPost("{vehicleId}/images/multiple")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadMultipleVehicleImages(
            int vehicleId,
            [FromForm] AddMultipleVehicleImagesRequest request)
        {
            // Ensure vehicleId matches
            request.VehicleId = vehicleId;

            await _ownerVehicleService.AddMultipleVehicleImages(request);

            return Ok(new
            {
                message = "Vehicle images uploaded successfully"
            });
        }

        // GET: api/owner/vehicles/{vehicleId}/details
        // Get vehicle details for edit page (includes all images)
        [HttpGet("{vehicleId}/details")]
        public async Task<IActionResult> GetVehicleDetails(int vehicleId)
        {
            try 
            {
                var details = await _ownerVehicleService.GetVehicleDetails(vehicleId);
                return Ok(details);
            }
            catch (Exception ex) when (ex.Message == "Vehicle not found")
            {
                return NotFound(new { message = "Vehicle not found" });
            }
        }

        // PUT: api/owner/vehicles/{vehicleId}/description
        // Update only vehicle description
        [HttpPut("{vehicleId}/description")]
        public async Task<IActionResult> UpdateVehicleDescription(
            int vehicleId,
            [FromBody] UpdateVehicleDescriptionRequest request)
        {
            await _ownerVehicleService.UpdateVehicleDescription(vehicleId, request);

            return Ok(new
            {
                message = "Vehicle description updated successfully"
            });
        }

        // DELETE: api/owner/vehicles/{vehicleId}
        // Delete vehicle and all its images (cascade delete)

        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            try
            {
                await _ownerVehicleService.DeleteVehicle(vehicleId);

                return Ok(new
                {
                    message = "Vehicle deleted successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // DELETE: api/owner/vehicles/images/{imageId}
        // Delete a single vehicle image
        [HttpDelete("images/{imageId}")]
        public async Task<IActionResult> DeleteVehicleImage(int imageId)
        {
            await _ownerVehicleService.DeleteVehicleImage(imageId);

            return Ok(new
            {
                message = "Vehicle image deleted successfully"
            });
        }

        // PUT: api/owner/vehicles/{vehicleId}/images/primary
        // Set a specific image as primary
        [HttpPut("{vehicleId}/images/primary")]
        public async Task<IActionResult> SetPrimaryImage(
            int vehicleId,
            [FromBody] UpdatePrimaryImageRequest request)
        {
            // Ensure vehicleId matches
            request.VehicleId = vehicleId;

            await _ownerVehicleService.SetPrimaryImage(request);

            return Ok(new
            {
                message = "Primary image updated successfully"
            });
        }

    }
}
