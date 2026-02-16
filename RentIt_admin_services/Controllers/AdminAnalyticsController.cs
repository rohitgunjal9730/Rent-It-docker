using Microsoft.AspNetCore.Mvc;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Controllers
{
    [ApiExplorerSettings(GroupName = "admin")]
    [ApiController]
    [Route("admin/analytics")]
    public class AdminAnalyticsController : Controller
    {
        private readonly IAdminAnalyticsService _analyticsService;

        public AdminAnalyticsController(IAdminAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var data = await _analyticsService.GetDashboardAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Return a sensible default if DB is not available
                return Ok(new { TotalUsers = 0, TotalVehicles = 0, ActiveBookings = 0, CompletedBookings = 0, CancelledBookings = 0 });
            }
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookingStats([FromQuery] string period = "daily", [FromQuery] int span = 30)
        {
            try
            {
                var data = await _analyticsService.GetBookingStatsAsync(period, span);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(new List<object>());
            }
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenue([FromQuery] int months = 6)
        {
            try
            {
                var data = await _analyticsService.GetRevenueAsync(months);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(new List<object>());
            }
        }

        [HttpGet("top-vehicle-types")]
        public async Task<IActionResult> GetTopVehicleTypes([FromQuery] int limit = 5)
        {
            try
            {
                var data = await _analyticsService.GetTopVehicleTypesAsync(limit);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(new List<object>());
            }
        }
    }
}
