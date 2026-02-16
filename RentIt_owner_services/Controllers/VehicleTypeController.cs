using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    // Controller for VehicleType endpoints
    // Base route: /api/vehicletypes
    [ApiController]
    [Route("owner/vehicletypes")]
    public class VehicleTypeController : ControllerBase
    {
        private readonly IVehicleTypeService _service;

        // Constructor with dependency injection of service
        public VehicleTypeController(IVehicleTypeService service)
        {
            _service = service;
        }

        // GET: /api/vehicletypes
        // Returns all vehicle types for dropdown selection
        [HttpGet]
        public async Task<ActionResult<List<VehicleTypeDto>>> GetAll()
        {
            var vehicleTypes = await _service.GetAllVehicleTypes();
            return Ok(vehicleTypes);
        }
    }
}
