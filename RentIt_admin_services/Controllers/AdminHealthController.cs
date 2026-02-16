using System;
using Microsoft.AspNetCore.Mvc;

namespace RentIt_admin_services.Controllers
{
    [ApiExplorerSettings(GroupName = "admin")]
    [ApiController]
    [Route("admin")]
    public class AdminHealthController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new {
                status = "UP",
                service = "admin"
            });
        }
    }
}
