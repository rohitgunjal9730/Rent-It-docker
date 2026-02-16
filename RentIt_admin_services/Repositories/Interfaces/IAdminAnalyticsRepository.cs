using RentIt_admin_services.DTOs;

namespace RentIt_admin_services.Repositories.Interfaces
{
    public interface IAdminAnalyticsRepository
    {
        Task<int> CountUsersAsync();
        Task<int> CountVehiclesAsync();
        Task<int> CountBookingsByStatusAsync(string status);

        Task<List<BookingStatDto>> GetBookingCountsByDayAsync(int days);
        Task<List<BookingStatDto>> GetBookingCountsByMonthAsync(int months);

        Task<List<RevenueDto>> GetRevenueByMonthAsync(int months);

        Task<List<TopVehicleTypeDto>> GetTopVehicleTypesAsync(int limit);
    }
}
