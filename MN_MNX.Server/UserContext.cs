using MN_MNX.Server.Models;
using MN_MNX.Server.Services;
using System.Security.Claims;

namespace MN_MNX.Server
{
    public class UserContext
    {
        public readonly UserData? User = null;
        public readonly bool IsAuthenticated = false;
        public readonly DateTime ContextDate = DateTime.UtcNow.AddHours(2);

        public UserContext(IHttpContextAccessor httpContext, UserService userService)
        {
            var userIdString = httpContext.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !long.TryParse(userIdString, out var userId))
                return;

            var user = userService.GetUserData(userId);
            if (user == null)
                return;

            IsAuthenticated = true;
            User = user;
        }
    }
}
