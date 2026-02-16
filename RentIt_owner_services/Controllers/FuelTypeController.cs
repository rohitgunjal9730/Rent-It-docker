using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    // Controller for FuelType endpoints
    // Base route: /api/fueltypes
    [ApiController]
    [Route("owner/fueltypes")]
    public class FuelTypeController : ControllerBase
    {
        private readonly IFuelTypeService _service;

        // Constructor with dependency injection of service
        public FuelTypeController(IFuelTypeService service)
        {
            _service = service;
        }

        // GET: /api/fueltypes
        // Returns all fuel types for dropdown selection
        [HttpGet]
        public async Task<ActionResult<List<FuelTypeDto>>> GetAll()
        {
            var fuelTypes = await _service.GetAllFuelTypes();
            return Ok(fuelTypes);
        }
    }
}
