using Microsoft.AspNetCore.Mvc;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private static List<UserDto> users = new()
        {
            new UserDto { Id = 1, FirstName = "Jonas", LastName = "Jonaitis" },
            new UserDto { Id = 2, FirstName = "Petras", LastName = "Petraitis" }
        };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(users);
        }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
    }
}