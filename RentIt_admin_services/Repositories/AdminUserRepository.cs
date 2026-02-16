using Microsoft.EntityFrameworkCore;
using RentIt_admin_services.Models;
using RentIt_admin_services.Repositories.Interfaces;

namespace RentIt_admin_services.Repositories
{
    public class AdminUserRepository : IAdminUserRepository
    {
        private readonly P20RentitContext _context;

        public AdminUserRepository(P20RentitContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetUsersByRole(int roleId)
        {
            return await _context.Users
                .Where(u => u.RoleId == roleId)
                .Include(u => u.Role)
                .Include(u => u.Area)
                    .ThenInclude(a => a.City)
                .ToListAsync();
        }

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
