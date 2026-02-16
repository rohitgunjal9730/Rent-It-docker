using Microsoft.AspNetCore.Mvc;
using RentIt_admin_services.DTOs;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Controllers
{
    [ApiExplorerSettings(GroupName = "admin")]
    [ApiController]
    [Route("admin/vehicle-types")]
    public class VehicleTypeController : ControllerBase
    {
        private readonly IVehicleTypeService _vehicleTypeService;

        public VehicleTypeController(IVehicleTypeService vehicleTypeService)
        {
            _vehicleTypeService = vehicleTypeService;
        }

        // GET: api/admin/vehicle-types
        // Get all vehicle types
        [HttpGet]
        public async Task<IActionResult> GetAllVehicleTypes()
        {
            try
            {
                var vehicleTypes = await _vehicleTypeService.GetAllVehicleTypesAsync();
                return Ok(vehicleTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred", details = ex.Message });
            }
        }

        // GET: api/admin/vehicle-types/{vehicleTypeId}
        // Get a specific vehicle type by ID
        [HttpGet("{vehicleTypeId}")]
        public async Task<IActionResult> GetVehicleTypeById(int vehicleTypeId)
        {
            try
            {
                var vehicleType = await _vehicleTypeService.GetVehicleTypeByIdAsync(vehicleTypeId);
                return Ok(vehicleType);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred", details = ex.Message });
            }
        }

        // POST: api/admin/vehicle-types
        // Add a new vehicle type
        [HttpPost]
        public async Task<IActionResult> AddVehicleType([FromBody] AddVehicleTypeRequest request)
        {
            try
            {
                var response = await _vehicleTypeService.AddVehicleTypeAsync(request);
                return CreatedAtAction(
                    nameof(AddVehicleType),
                    new { id = response.VehicleTypeId },
                    response
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // Duplicate ID scenario
                return Conflict(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred", details = ex.Message });
            }
        }

        // PUT: api/admin/vehicle-types/{vehicleTypeId}
        // Edit an existing vehicle type
        [HttpPut("{vehicleTypeId}")]
        public async Task<IActionResult> EditVehicleType(
            int vehicleTypeId,
            [FromBody] EditVehicleTypeRequest request)
        {
            try
            {
                // Validate that route parameter matches request body
                if (vehicleTypeId != request.VehicleTypeId)
                {
                    return BadRequest(new { error = "Vehicle type ID in URL does not match request body" });
                }

                var response = await _vehicleTypeService.EditVehicleTypeAsync(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred", details = ex.Message });
            }
        }
    }
}
