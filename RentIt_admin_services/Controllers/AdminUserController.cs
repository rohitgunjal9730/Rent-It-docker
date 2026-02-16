using Microsoft.AspNetCore.Mvc;
using RentIt_admin_services.DTOs;
using RentIt_admin_services.Servises.Interfaces;

namespace RentIt_admin_services.Controllers
{
    [ApiExplorerSettings(GroupName = "admin")]
    [ApiController]
    [Route("admin/users")]
    public class AdminUserController : Controller
    {
        private readonly IAdminUserService _adminUserService;

        public AdminUserController(IAdminUserService adminUserService)
        {
            _adminUserService = adminUserService;
        }

        // GET: api/admin/users/customers
        // Get all customers
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _adminUserService.GetAllCustomers();
            return Ok(customers);
        }

        // GET: api/admin/users/owners
        // Get all owners
        [HttpGet("owners")]
        public async Task<IActionResult> GetAllOwners()
        {
            var owners = await _adminUserService.GetAllOwners();
            return Ok(owners);
        }

        // GET: api/admin/users/role/{roleId}
        // Get users by specific role ID (flexible endpoint)
        [HttpGet("role/{roleId}")]
        public async Task<IActionResult> GetUsersByRole(int roleId)
        {
            var users = await _adminUserService.GetUsersByRole(roleId);
            return Ok(users);
        }

        // PUT: api/admin/users/{userId}/approval
        // Update user approval status
        [HttpPut("{userId}/approval")]
        public async Task<IActionResult> UpdateUserApproval(
            int userId,
            [FromBody] UpdateUserApprovalRequest request)
        {
            try
            {
                await _adminUserService.ApproveUser(userId, request.ApprovalStatus);
                return Ok(new
                {
                    message = "User approval status updated successfully",
                    userId,
                    approvalStatus = request.ApprovalStatus
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
