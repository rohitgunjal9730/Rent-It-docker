using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Controllers
{
    [ApiController]
    [Route("owner/bookings")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet("{ownerId}")]
        public async Task<IActionResult> GetOwnerBookings(int ownerId)
        {
            var bookings = await _bookingService.GetBookingsByOwnerId(ownerId);
            return Ok(bookings);
        }
        [HttpPost("{bookingId}/complete-return")]
        public async Task<IActionResult> CompleteReturn(int bookingId, [FromQuery] int ownerId)
        {
            try
            {
                var booking = await _bookingService.CompleteReturn(bookingId, ownerId);
                return Ok(booking);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{bookingId}/refund-confirm")]
        public async Task<IActionResult> ConfirmRefund(int bookingId, [FromQuery] int ownerId)
        {
            try
            {
                var booking = await _bookingService.ConfirmRefund(bookingId, ownerId);
                return Ok(booking);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
