using System.Collections.Generic;
using System.Threading.Tasks;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;

namespace RentIt_owner_services.Services.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<OwnerBookingDTO>> GetBookingsByOwnerId(int ownerId);
        Task<Booking> CompleteReturn(int bookingId, int ownerId);
        Task<bool> HasActiveBookings(int vehicleId);
        Task<Booking> ConfirmRefund(int bookingId, int ownerId);
    }
}
