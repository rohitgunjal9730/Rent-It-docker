using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    // Controller for Model endpoints
    // Base route: /api/models
    [ApiController]
    [Route("owner/models")]
    public class ModelController : ControllerBase
    {
        private readonly IModelService _service;

        // Constructor with dependency injection of service
        public ModelController(IModelService service)
        {
            _service = service;
        }

        // GET: /api/models/brand/{brandId}
        // Returns all models for a specific brand (dependent dropdown)
        // Example: /api/models/brand/1
        [HttpGet("brand/{brandId}")]
        public async Task<ActionResult<List<ModelDto>>> GetByBrand(int brandId)
        {
            var models = await _service.GetModelsByBrandId(brandId);
            return Ok(models);
        }
    }
}
