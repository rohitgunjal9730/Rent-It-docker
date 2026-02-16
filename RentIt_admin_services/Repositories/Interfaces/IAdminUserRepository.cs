using RentIt_admin_services.Models;

namespace RentIt_admin_services.Repositories.Interfaces
{
    public interface IAdminUserRepository
    {
        Task<List<User>> GetUsersByRole(int roleId);
        Task<User?> GetUserById(int userId);
        Task SaveChanges();
    }
}
