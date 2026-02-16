using Microsoft.EntityFrameworkCore;
using RentIt_admin_services.DTOs;
using RentIt_admin_services.Models;
using RentIt_admin_services.Repositories.Interfaces;

namespace RentIt_admin_services.Repositories
{
    public class AdminAnalyticsRepository : IAdminAnalyticsRepository
    {
        private readonly P20RentitContext _context;

        public AdminAnalyticsRepository(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<int> CountUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> CountVehiclesAsync()
        {
            return await _context.Vehicles.CountAsync();
        }

        public async Task<int> CountBookingsByStatusAsync(string status)
        {
            return await _context.Bookings.CountAsync(b => b.BookingStatus != null && b.BookingStatus.ToUpper() == status.ToUpper());
        }

        public async Task<List<BookingStatDto>> GetBookingCountsByDayAsync(int days)
        {
            var from = DateTime.UtcNow.Date.AddDays(-days + 1);
            var query = await _context.Bookings
                .Where(b => b.BookingDate >= from)
                .GroupBy(b => b.BookingDate.Date)
                .Select(g => new BookingStatDto { Period = g.Key.ToString("yyyy-MM-dd"), Count = g.Count() })
                .OrderBy(d => d.Period)
                .ToListAsync();
            return query;
        }

        public async Task<List<BookingStatDto>> GetBookingCountsByMonthAsync(int months)
        {
            var from = DateTime.UtcNow.Date.AddMonths(-months + 1);
            var query = await _context.Bookings
                .Where(b => b.BookingDate >= from)
                .GroupBy(b => new { b.BookingDate.Year, b.BookingDate.Month })
                .Select(g => new BookingStatDto { Period = g.Key.Year + "-" + g.Key.Month.ToString("D2"), Count = g.Count() })
                .OrderBy(d => d.Period)
                .ToListAsync();
            return query;
        }

        public async Task<List<RevenueDto>> GetRevenueByMonthAsync(int months)
        {
            var from = DateTime.UtcNow.Date.AddMonths(-months + 1);
            var query = await _context.Bookings
                .Where(b => b.BookingDate >= from && b.PaidAmount != null)
                .GroupBy(b => new { b.BookingDate.Year, b.BookingDate.Month })
                .Select(g => new RevenueDto { Period = g.Key.Year + "-" + g.Key.Month.ToString("D2"), Revenue = g.Sum(x => x.PaidAmount ?? 0) })
                .OrderBy(r => r.Period)
                .ToListAsync();
            return query;
        }

        public async Task<List<TopVehicleTypeDto>> GetTopVehicleTypesAsync(int limit)
        {
            var query = await _context.Bookings
                .Include(b => b.Vehicle)
                    .ThenInclude(v => v.VehicleType)
                .GroupBy(b => b.Vehicle.VehicleType.VehicleTypeName)
                .Select(g => new TopVehicleTypeDto { VehicleTypeName = g.Key ?? "Unknown", BookingsCount = g.Count() })
                .OrderByDescending(x => x.BookingsCount)
                .Take(limit)
                .ToListAsync();
            return query;
        }
    }
}
