using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using MN_MNX.Server.Helpers;
using MN_MNX.Server.Models;
using MN_MNX.Server.React.User.Models;
using MN_MNX.Server.Services;
using System.Globalization;

namespace MN_MNX.Server.React.User
{
    [Route($"api/{UserConstants.OBJECT_USER}")]
    [ApiController]
    public class UserController(UserService userService, UserContext userContext) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly UserData? _user = userContext.User;

        public async Task<ActionResult> HandleRequest([FromQuery] string type, [FromQuery] string operation)
        {
            try
            {
                object? result = null;

                var postParams = new Dictionary<string, string>();
                foreach (var item in Request.Form)
                    postParams[item.Key] = item.Value;

                switch (type)
                {
                    case UserConstants.TYPE_USER_LIST:
                        result = HandleListRequest(operation, postParams);
                        if (result == null)
                            throw new Exception("Error getting user list data");
                        break;
                    case UserConstants.TYPE_USER_FORM:
                        result = HandleFormRequest(operation, postParams);
                        if (result == null)
                            throw new Exception("Error saving user form data");
                        break;
                    default:
                        throw new Exception("Error, invalid user type");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        #region Admin user list

        private object? HandleListRequest(string operation, Dictionary<string, string> postParams)
        {
            object? result = null;
            try
            {
                switch (operation)
                {
                    case UserConstants.OPER_USER_LIST_GET:
                        result = GetListData();
                        if (result == null)
                            throw new Exception("Error getting post list data");
                        break;
                    case UserConstants.OPER_USER_LIST_DELETE:
                        result = DeleteUserData(postParams);
                        if (result == null)
                            throw new Exception("Error deleting post data");
                        break;
                    default:
                        throw new Exception("Error, invalid post list operation");
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return result;
        }

        private List<UserListJson>? GetListData()
        {
            try
            {
                var result = new List<UserListJson>();

                var userData = _userService.GetUserList();
                if (userData == null)
                    throw new Exception("Error getting user data");

                foreach (var item in userData)
                {
                    result.Add(new UserListJson
                    {
                        Id = item.Id.ToString(),
                        Name = item.Name,
                        Surname = item.Surname,
                        Email = item.Email,
                        Birthday = item.DtBirthday?.ToLocalTime().ToString("dd/MM/yyyy") ?? string.Empty,
                        Role = ((int)item.Role).ToString(),
                        CreatedAt = item.DtuCreatedAt.ToLocalTime().ToString()
                    });
                }

                return result;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        private bool? DeleteUserData(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetValue("ids", out var tmpStr) || !tmpStr.TryDeserializeJsonIds(out var ids) || !_userService.DeleteUsers(ids))
                    throw new Exception("Error deleting users");

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        #endregion Admin user list

        #region Admin user form

        private object? HandleFormRequest(string operation, Dictionary<string, string> postParams)
        {
            object? result = null;
            try
            {
                switch (operation)
                {
                    case UserConstants.OPER_USER_FORM_GET:
                        result = GetFormData(postParams);
                        if (result == null)
                            throw new Exception("Error getting post form data");
                        break;
                    case UserConstants.OPER_USER_FORM_SAVE:
                        result = SaveFormData(postParams);
                        if (result == null)
                            throw new Exception("Error saving post form data");
                        break;
                    default:
                        throw new Exception("Error, invalid post form operation");
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return result;
        }

        private UserFormJson? GetFormData(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetValue("id", out var tmpStr) || !long.TryParse(tmpStr, out var id))
                    throw new Exception("Error getting id param");

                var formData = new UserFormJson();
                if (id > 0)
                {
                    var userData = _userService.GetUserData(id);
                    if (userData == null)
                        throw new Exception("Error getting post data");

                    formData = new UserFormJson
                    {
                        Id = userData.Id.ToString(),
                        Name = userData.Name,
                        Surname = userData.Surname,
                        Email = userData.Email,
                        Role = ((int)userData.Role).ToString(),
                        DefaultTimeZone = userData.DefaultTimeZone,
                        Birthday = userData.DtBirthday?.ToString("yyyy-MM-dd") ?? string.Empty
                    };
                }

                return formData;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        private string? SaveFormData(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetValue("id", out var tmpStr) || !long.TryParse(tmpStr, out var id))
                    throw new Exception("Error getting id param");

                if (!postParams.TryGetValue("surname", out var surname) || string.IsNullOrWhiteSpace(surname))
                    throw new Exception("Error getting surname param");

                if (!postParams.TryGetValue("email", out var email) || string.IsNullOrWhiteSpace(email))
                    throw new Exception("Error getting email param");

                var userData = new UserData();
                if (id > 0)
                {
                    userData = _userService.GetUserData(id);
                    if (userData == null)
                        throw new Exception("Error getting user data");
                }

                userData.Surname = surname.Trim();
                userData.Email = email.Trim();

                if (postParams.TryGetValue("name", out var name))
                    userData.Name = name.Trim();

                if (postParams.TryGetValue("role", out tmpStr) && Enum.TryParse(tmpStr, out EUserRole role))
                    userData.Role = role;

                if (postParams.TryGetValue("password", out tmpStr) && !string.IsNullOrWhiteSpace(tmpStr))
                    userData.Password = UserHelper.EncryptPassword(tmpStr);

                if (id > 0 && postParams.TryGetValue("defaultTimeZone", out tmpStr) && !string.IsNullOrWhiteSpace(tmpStr) && GenericHelper.GetTimeZoneCollection().TryGetValue(tmpStr, out var timeZone))
                {
                    userData.DefaultTimeZone = tmpStr;
                    userData.UseDayLightSaving = timeZone.SupportsDaylightSavingTime;
                }

                if (postParams.TryGetValue("birthday", out tmpStr))
                {
                    if (DateTime.TryParseExact(tmpStr, "yyyy-MM-dd", new CultureInfo(1062), DateTimeStyles.None, out var birthday))
                        userData.DtBirthday = birthday;
                    else
                        userData.DtBirthday = null;
                }

                var res = _userService.SaveUserData(userData);
                if (res <= 0)
                    throw new Exception("Error saving user data");

                return res.ToString();
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        #endregion Admin user form
    }
}
