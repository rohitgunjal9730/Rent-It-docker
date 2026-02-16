using RentIt_admin_services.DTOs;
using RentIt_admin_services.Repositories.Interfaces;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Servises
{
    public class AdminUserService : IAdminUserService
    {
        private readonly IAdminUserRepository _repository;

        public AdminUserService(IAdminUserRepository repository)
        {
            _repository = repository;
        }

        // Get users by specific role ID
        public async Task<List<AdminUserDto>> GetUsersByRole(int roleId)
        {
            var users = await _repository.GetUsersByRole(roleId);

            return users.Select(u => new AdminUserDto
            {
                UserId = u.UserId,
                RoleName = u.Role.RoleName,
                Fname = u.Fname,
                Mname = u.Mname,
                Lname = u.Lname,
                Phone = u.Phone,
                Email = u.Email,
                DrivingLicenceNo = u.DrivingLicenceNo,
                AdharNo = u.AdharNo,
                PanNo = u.PanNo,
                Address = u.Address,
                AreaName = u.Area?.AreaName,
                CityName = u.Area?.City?.CityName,
                ApprovalStatus = u.ApprovalStatus?.ToString(),
                IsActive = u.IsActive?.ToString()
            }).ToList();
        }

        // Get all customers (assuming role_id = 1 for customers)
        // You can modify the role ID based on your database values
        public async Task<List<AdminUserDto>> GetAllCustomers()
        {
            // Role ID 1 typically represents Customer
            // Modify this if your database uses different role IDs
            return await GetUsersByRole(2);
        }

        // Get all owners (assuming role_id = 2 for owners)
        // You can modify the role ID based on your database values
        public async Task<List<AdminUserDto>> GetAllOwners()
        {
            // Role ID 2 typically represents Owner
            // Modify this if your database uses different role IDs
            return await GetUsersByRole(3);
        }

        // Approve or reject user
        public async Task ApproveUser(int userId, string approvalStatus)
        {
            var user = await _repository.GetUserById(userId);

            if (user == null)
                throw new Exception($"User with ID {userId} not found");

            // Validate approval status
            if (!Enum.TryParse<RentIt_admin_services.Models.Enums.UserApprovalStatus>(approvalStatus, true, out var statusEnum))
                throw new Exception("Invalid approval status.");

            user.ApprovalStatus = statusEnum;
            await _repository.SaveChanges();
        }
    }
}
