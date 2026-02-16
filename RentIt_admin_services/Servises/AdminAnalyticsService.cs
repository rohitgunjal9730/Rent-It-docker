using RentIt_admin_services.DTOs;
using RentIt_admin_services.Repositories.Interfaces;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Servises
{
    public class AdminAnalyticsService : IAdminAnalyticsService
    {
        private readonly IAdminAnalyticsRepository _repo;

        public AdminAnalyticsService(IAdminAnalyticsRepository repo)
        {
            _repo = repo;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync()
        {
            var totalUsers = await _repo.CountUsersAsync();
            var totalVehicles = await _repo.CountVehiclesAsync();
            var active = await _repo.CountBookingsByStatusAsync("CONFIRMED");
            var completed = await _repo.CountBookingsByStatusAsync("COMPLETED");
            var cancelled = await _repo.CountBookingsByStatusAsync("CANCELLED");

            return new AdminDashboardDto
            {
                TotalUsers = totalUsers,
                TotalVehicles = totalVehicles,
                ActiveBookings = active,
                CompletedBookings = completed,
                CancelledBookings = cancelled
            };
        }

        public async Task<List<BookingStatDto>> GetBookingStatsAsync(string period, int span)
        {
            if (period?.ToLower() == "daily")
            {
                return await _repo.GetBookingCountsByDayAsync(span);
            }
            return await _repo.GetBookingCountsByMonthAsync(span);
        }

        public async Task<List<RevenueDto>> GetRevenueAsync(int months)
        {
            return await _repo.GetRevenueByMonthAsync(months);
        }

        public async Task<List<TopVehicleTypeDto>> GetTopVehicleTypesAsync(int limit)
        {
            return await _repo.GetTopVehicleTypesAsync(limit);
        }
    }
}
