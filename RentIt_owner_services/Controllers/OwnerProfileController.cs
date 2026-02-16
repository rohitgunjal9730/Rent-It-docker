using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Services.Interfaces;
using System.Threading.Tasks;

namespace RentIt_owner_services.Controllers
{
    [Route("owner/profile")]
    [ApiController]
    public class OwnerProfileController : ControllerBase
    {
        private readonly IOwnerProfileService _profileService;

        public OwnerProfileController(IOwnerProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _profileService.GetOwnerProfile(userId);
            if (profile == null) return NotFound("Owner not found");
            return Ok(profile);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] UpdateProfileDTO updateDto)
        {
            var result = await _profileService.UpdateOwnerProfile(userId, updateDto);
            if (!result) return BadRequest("Failed to update profile");
            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            var cities = await _profileService.GetCities();
            return Ok(cities);
        }

        [HttpGet("cities/{cityId}/areas")]
        public async Task<IActionResult> GetAreas(int cityId)
        {
            var areas = await _profileService.GetAreasByCity(cityId);
            return Ok(areas);
        }
    }
}
