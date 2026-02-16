using RentIt_admin_services.DTOs;

namespace RentIt_admin_services.Servises.Interfaces
{
    public interface IAdminAnalyticsService
    {
        Task<AdminDashboardDto> GetDashboardAsync();
        Task<List<BookingStatDto>> GetBookingStatsAsync(string period, int span);
        Task<List<RevenueDto>> GetRevenueAsync(int months);
        Task<List<TopVehicleTypeDto>> GetTopVehicleTypesAsync(int limit);
    }
}
