using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Helpers;
using MN_MNX.Server.Models;
using MN_MNX.Server.Services;
using System.Security.Claims;

namespace MN_MNX.Server.React.Public
{
    [Route($"api/{PublicConstants.OBJECT_PUBLIC}")]
    [ApiController]
    public class PublicController(UserService userService, UserContext userContext) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly UserData? _user = userContext.User;

        [HttpPost]
        public async Task<ActionResult> HandleRequest([FromQuery] string type, [FromQuery] string operation)
        {
            try
            {
                var postParams = new Dictionary<string, string>();
                foreach (var item in Request.Form)
                    postParams[item.Key] = item.Value;

                switch (type)
                {
                    case PublicConstants.TYPE_PUBLIC_USER:
                        return await HandleUserRequest(operation, postParams);
                    default:
                        throw new Exception("Error, invalid public type");
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        private async Task<ActionResult> HandleUserRequest(string operation, Dictionary<string, string> postParams)
        {
            try
            {
                switch (operation)
                {
                    case PublicConstants.OPER_PUBLIC_USER_LOGIN:
                        return await LoginUser(postParams);
                    case PublicConstants.OPER_PUBLIC_USER_LOGOUT:
                        return await LogoutUser();
                    case PublicConstants.OPER_PUBLIC_USER_GET:
                        return GetUser();
                    default:
                        throw new Exception("Invalid public user operation");
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        private async Task<ActionResult> LoginUser(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetString("email", out var email))
                    throw new Exception("Error getting email");

                if (!postParams.TryGetString("password", out var password))
                    throw new Exception("Error getting password");

                var userCollection = _userService.GetAllUserCollectionByEmail();
                if (!userCollection.TryGetValue(email, out var user) || user.Password != UserHelper.EncryptPassword(password))
                    throw new Exception("User doesn't exist or password is incorrect");

                var claims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new(ClaimTypes.Name, user.Name),
                    new(ClaimTypes.Surname, user.Surname),
                    new(ClaimTypes.Email, user.Email),
                    new(ClaimTypes.Role, user.Role.ToString())
                };

                var identity = new ClaimsIdentity(claims, "MNCookieAuthenticationScheme");
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(principal);

                return Ok();
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        private async Task<ActionResult> LogoutUser()
        {
            try
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

                return Ok();
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        private ActionResult GetUser()
        {
            try
            {
                if (!userContext.IsAuthenticated)
                    return NoContent();

                var userDataResponse = new Dictionary<string, object>
                {
                    { "Name", _user.Name },
                    { "Surname", _user.Surname },
                    { "Email", _user.Email },
                    { "Id", _user.Id.ToString() }
                };

                var userProfileSettings = _userService.GetUserProfileSettings(_user.Id);
                if (!string.IsNullOrWhiteSpace(userProfileSettings.ImageUrl))
                    userDataResponse["ProfileImage"] = Helper.GetImageUrl($"User_{_user.Id}/{userProfileSettings.ImageUrl}");

                if (_user.Role == EUserRole.Admin)
                    userDataResponse.Add("IsAdmin", true);

                return Ok(userDataResponse);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        [HttpGet(PublicConstants.TYPE_PUBLIC_IMAGE)]
        public ActionResult HandleImageRequest([FromQuery] string ticks, [FromQuery] string image)
        {
            try
            {
                var imagePath = $"{Environment.CurrentDirectory}/Assets/Public/Images/";
                var imageStream = System.IO.File.OpenRead($"{imagePath}{Uri.UnescapeDataString(image)}");

                return File(imageStream, "image/jpeg");
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }
    }
}
