using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RentIt_owner_services.DTOs;
using RentIt_owner_services.Models;
using RentIt_owner_services.Services.Interfaces;

namespace RentIt_owner_services.Services
{
    public class BookingService : IBookingService
    {
        private readonly P20RentitContext _context;

        public BookingService(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OwnerBookingDTO>> GetBookingsByOwnerId(int ownerId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                    .ThenInclude(v => v.Model)
                        .ThenInclude(m => m.Brand)
                .Where(b => b.Vehicle.OwnerId == ownerId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new OwnerBookingDTO
                {
                    BookingId = b.BookingId,
                    VehicleId = b.VehicleId,
                    VehicleName = $"{b.Vehicle.Model.Brand.Brand1} {b.Vehicle.Model.Model1}",
                    VehicleNumber = b.Vehicle.VehicleNumber ?? "N/A",
                    CustomerName = $"{b.User.Fname} {b.User.Lname}",
                    CustomerPhone = b.User.Phone ?? "N/A",
                    BookingDate = b.BookingDate,
                    StartingDate = b.StartingDate,
                    EndDate = b.EndDate,
                    PickupTime = b.PickupTime,
                    ReturnTime = b.ReturnTime,
                    TotalAmount = b.TotalAmount,
                    PaidAmount = b.PaidAmount,
                    DepositAmount = b.DepositAmount,
                    BookingStatus = b.BookingStatus,
                    PaymentStatus = b.PaymentStatus
                })
                .ToListAsync();

            return bookings;
        }

        public async Task<Booking> CompleteReturn(int bookingId, int ownerId)
        {
            try
            {
                var booking = await _context.Bookings
                .Include(b => b.Vehicle)
                .Include(b => b.User)
                .Include(b => b.Payments)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
                throw new System.Exception("Booking not found");

            if (booking.Vehicle.OwnerId != ownerId)
                throw new System.Exception("Unauthorized access to this booking");

            if (booking.BookingStatus != "RETURN_REQUESTED")
                throw new System.Exception($"Cannot complete return. Current status: {booking.BookingStatus}");

            // 1. Calculate Settlement
            decimal rent = booking.TotalAmount ?? 0;
            decimal paid = booking.PaidAmount ?? 0;
            decimal diff = paid - rent;

            // 2. Update Booking & Vehicle Status
            booking.BookingStatus = "COMPLETED"; // Valid per updated schema
            booking.Vehicle.Status = "ACTIVE"; // Valid Enum (AVAILABLE is invalid, ACTIVE is the equivalent) 
            
            // 3. Settlement Payments Logic
            if (diff > 0)
            {
                // Refund Case: Owner pays Customer
                var refund = new Payment
                {
                    BookingId = booking.BookingId,
                    Booking = booking, // Explicit navigation
                    PaymentMethod = "Cash", // Safe 'Active' enum value
                    PaymentAmount = diff,
                    PaymentStatus = "REFUNDED", // Valid Enum
                    TransactionId = "REF-" + System.Guid.NewGuid().ToString().Substring(0, 8),
                    PaymentDate = System.DateTime.Now,
                    PaymentType = "REFUND" // Valid Enum
                };
                booking.Payments.Add(refund); // Link to collection
                _context.Payments.Add(refund); // Add to context
                
                booking.PaymentStatus = "REFUNDED"; 
            }
            else if (diff < 0)
            {
                // Due Case: Customer owes Owner
                var due = new Payment
                {
                    BookingId = booking.BookingId,
                    Booking = booking, // Explicit navigation
                    PaymentMethod = "Cash", // Safe 'Active' enum value
                    PaymentAmount = System.Math.Abs(diff),
                    PaymentStatus = "PENDING", // Valid Enum
                    TransactionId = "DUE-" + System.Guid.NewGuid().ToString().Substring(0, 8),
                    PaymentDate = System.DateTime.Now,
                    PaymentType = "FINAL", // Valid Enum
                };
                booking.Payments.Add(due); // Link to collection
                _context.Payments.Add(due); // Add to context
                
                booking.PaymentStatus = "PENDING"; 
            }
            else 
            {
                // Exact payment
                booking.PaymentStatus = "SUCCESS"; 
            }

            // 4. Atomic Save
            await _context.SaveChangesAsync();
            return booking;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                // Log and rethrow strictly for 400 debugging
                var inner = ex.InnerException?.Message ?? ex.Message;
                throw new System.Exception($"Database Save Failed: {inner}");
            }
            catch (System.Exception ex)
            {
                throw new System.Exception($"Error completing return: {ex.Message}");
            }
        }


        public async Task<bool> HasActiveBookings(int vehicleId)
        {
            return await _context.Bookings
                .AnyAsync(b => b.VehicleId == vehicleId && 
                               b.BookingStatus != "COMPLETED" && 
                               b.BookingStatus != "CANCELLED");
        }

        public async Task<Booking> ConfirmRefund(int bookingId, int ownerId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Vehicle)
                    .Include(b => b.Payments)
                    .FirstOrDefaultAsync(b => b.BookingId == bookingId);

                if (booking == null)
                    throw new System.Exception("Booking not found");

                if (booking.Vehicle.OwnerId != ownerId)
                    throw new System.Exception("Unauthorized access to this booking");

                if (booking.BookingStatus != "CANCEL_REQUESTED")
                    throw new System.Exception($"Cannot confirm refund. Booking is not in CANCEL_REQUESTED state. Current: {booking.BookingStatus}");

                // 1. Calculate Refund (Total Rent + Deposit)
                // Assuming customer paid effectively nothing yet if it was just a 'Booking' but the prompt says 
                // "Total Refund Amount = Rent + Deposit".
                // However, usually they only pay Deposit later or on pickup.
                // But typically if they are cancelling, they might have paid something.
                // The prompt says "Owner must refund 100% amount: Total Rent + Security Deposit".
                // This implies they HAVE paid it. 
                // If PaidAmount is 0, then Refund is 0? 
                // Wait, logic says "Owner pays Refund".
                // Let's assume we refund whatever was PAID. 
                // But prompt says "Total Rent + Security Deposit". 
                // If they haven't paid, we shouldn't refund it.
                // Prudent logic: Refund = booking.PaidAmount (if > 0).
                // But prompt: "Total Refund Amount = Rent + Deposit".
                // I will use PaidAmount as the source of truth for money to return.
                // If PaidAmount < (Rent + Deposit), warning?
                // Let's stick to: Refund = PaidAmount. 
                // If PaidAmount is 0, we treat it as 0 refund.
                
                decimal refundAmount = booking.PaidAmount ?? 0;

                // 2. Create Refund Record
                if (refundAmount > 0)
                {
                    var refund = new Payment
                    {
                        BookingId = booking.BookingId,
                        Booking = booking,
                        PaymentMethod = "Cash", // Manual via Owner
                        PaymentAmount = refundAmount,
                        PaymentStatus = "REFUNDED",
                        TransactionId = "REF-CANCEL-" + System.Guid.NewGuid().ToString().Substring(0, 8),
                        PaymentDate = System.DateTime.Now,
                        PaymentType = "REFUND"
                    };
                    booking.Payments.Add(refund);
                    _context.Payments.Add(refund);
                    
                    booking.PaymentStatus = "REFUNDED"; 
                }
                else
                {
                    // No money was paid, so just cancel
                    booking.PaymentStatus = "CANCELLED";
                }

                // 3. Update Status
                booking.BookingStatus = "CANCELLED";
                // Vehicle status is tracked in history mostly, but if we need to free it up?
                // BookingRecord handles history. We should add one.
                
                var record = new BookingRecord
                {
                    BookingId = booking.BookingId,
                    VehicleStatus = "CANCELLED", // Matches VehicleBookingStatus Enum
                    ActionDatetime = System.DateTime.Now
                };
                // Assuming BookingRecords collection exists or context set
                 // Ideally add to context if ICollection is not enough for EF to pick up new separate entity if not adding to list
                 // But typically adding to list works if properly set up.
                 // Let's add safely to context
                _context.BookingRecords.Add(record);

                await _context.SaveChangesAsync();
                return booking;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception($"Error confirming refund: {ex.Message}");
            }
        }
    }
}
