using RentIt_admin_services.DTOs;

namespace RentIt_admin_services.Servises.Interfaces
{
    public interface IAdminUserService
    {
        Task<List<AdminUserDto>> GetUsersByRole(int roleId);
        Task<List<AdminUserDto>> GetAllCustomers();
        Task<List<AdminUserDto>> GetAllOwners();
        Task ApproveUser(int userId, string approvalStatus);
    }
}
