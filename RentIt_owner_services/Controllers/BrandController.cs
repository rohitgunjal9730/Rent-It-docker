using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    // Controller for Brand endpoints
    // Base route: /api/brands
    [ApiController]
    [Route("owner/brands")]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _service;

        // Constructor with dependency injection of service
        public BrandController(IBrandService service)
        {
            _service = service;
        }

        // GET: /api/brands
        // Returns all brands for dropdown selection
        [HttpGet]
        public async Task<ActionResult<List<BrandDto>>> GetAll()
        {
            var brands = await _service.GetAllBrands();
            return Ok(brands);
        }
    }
}
