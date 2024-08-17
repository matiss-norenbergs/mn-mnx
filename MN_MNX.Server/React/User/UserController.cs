using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Helpers;
using MN_MNX.Server.Models;
using MN_MNX.Server.React.User.Models;
using MN_MNX.Server.Services;
using System.Drawing;
using System.Globalization;

namespace MN_MNX.Server.React.User
{
    [Route($"api/{UserConstants.OBJECT_USER}")]
    [ApiController]
    public class UserController(UserService userService, UserContext userContext) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly UserData? _user = userContext.User;

        [Authorize(Roles = "Admin,User")]
        [HttpPost]
        public async Task<ActionResult> HandleRequest([FromQuery] string type, [FromQuery] string operation)
        {
            try
            {
                object? result = null;

                if (_user.Role == EUserRole.User && (UserConstants.TYPE_USER_LIST == type || UserConstants.TYPE_USER_FORM == type))
                    return Unauthorized();

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
                            throw new Exception("Error getting user form data");
                        break;
                    case UserConstants.TYPE_USER_PROFILE_SETTINGS:
                        result = await HandleProfileSettingsRequest(operation, postParams);
                        if (result == null)
                            throw new Exception("Error getting user profile settings data");
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
                            throw new Exception("Error getting user list data");
                        break;
                    case UserConstants.OPER_USER_LIST_DELETE:
                        result = DeleteUserData(postParams);
                        if (result == null)
                            throw new Exception("Error deleting user data");
                        break;
                    default:
                        throw new Exception("Error, invalid user list operation");
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
                if (!postParams.TryGetIdList("ids", out var ids) || !_userService.DeleteUsers(ids))
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
                            throw new Exception("Error getting user form data");
                        break;
                    case UserConstants.OPER_USER_FORM_SAVE:
                        result = SaveFormData(postParams);
                        if (result == null)
                            throw new Exception("Error saving user form data");
                        break;
                    default:
                        throw new Exception("Error, invalid user form operation");
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
                if (!postParams.TryGetId("id", out var id))
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
                if (!postParams.TryGetId("id", out var id))
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

                if (postParams.TryGetValue("role", out var tmpStr) && Enum.TryParse(tmpStr, out EUserRole role))
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

        #region User profile settings

        private async Task<object?> HandleProfileSettingsRequest(string operation, Dictionary<string, string> postParams)
        {
            object? result = null;
            try
            {
                switch (operation)
                {
                    case UserConstants.OPER_USER_PROFILE_SETTINGS_GET:
                        result = GetUserProfileSettingsFormData(postParams);
                        if (result == null)
                            throw new Exception("Error getting user profile settings data");
                        break;
                    case UserConstants.OPER_USER_PROFILE_SETTINGS_SAVE:
                        result = await SaveUserProfileSettingsFormData(postParams);
                        if (result == null)
                            throw new Exception("Error saving user profile settings data");
                        break;
                    default:
                        throw new Exception("Error, invalid user profile settings operation");
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return result;
        }

        private UserProfileSettingsJson? GetUserProfileSettingsFormData(Dictionary<string, string> postParams)
        {
            try
            {
                var settings = _userService.GetUserProfileSettings(_user.Id);
                var hiddenDetails = (EUserProfileDetails)settings.HiddenProfileDetails;

                var result = new UserProfileSettingsJson
                {
                    ShowFullName = !hiddenDetails.HasFlag(EUserProfileDetails.FullName),
                    ShowEmail = !hiddenDetails.HasFlag(EUserProfileDetails.Email),
                    ShowBirthday = !hiddenDetails.HasFlag(EUserProfileDetails.Birthday)
                };

                return result;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        private async Task<bool?> SaveUserProfileSettingsFormData(Dictionary<string, string> postParams)
        {
            try
            {
                var settings = _userService.GetUserProfileSettings(_user.Id);
                var hiddenDetails = (EUserProfileDetails)settings.HiddenProfileDetails;

                if (postParams.TryGetBool("showFullName", out var tmpBool))
                    HandleDetail(ref hiddenDetails, EUserProfileDetails.FullName, tmpBool);

                if (postParams.TryGetBool("showEmail", out tmpBool))
                    HandleDetail(ref hiddenDetails, EUserProfileDetails.Email, tmpBool);

                if (postParams.TryGetBool("showBirthday", out tmpBool))
                    HandleDetail(ref hiddenDetails, EUserProfileDetails.Birthday, tmpBool);

                var imageName = string.Empty;

                var profilePicture = Request.Form.Files.FirstOrDefault();
                if (profilePicture != null)
                {
                    //var fileExtension = Path.GetExtension(profilePicture.FileName);

                    imageName = $"ProfileImage_{_user.Id}.jpg";

                    var imagePath = $"{Environment.CurrentDirectory}/Assets/Public/Images/User_{_user.Id}";
                    var imageFullPath = $"{imagePath}/{imageName}";

                    Directory.CreateDirectory(imagePath);

                    using (Image img = Image.FromStream(profilePicture.OpenReadStream(), true, true))
                    {
                        var width = 200;
                        var height = 200;

                        var newImage = new Bitmap(width, height);

                        using (var g = Graphics.FromImage(newImage))
                            g.DrawImage(img, 0, 0, width, height);

                        newImage.Save(imageFullPath, System.Drawing.Imaging.ImageFormat.Jpeg);
                    }

                    settings.ImageUrl = imageName;
                }

                settings.HiddenProfileDetails = (int)hiddenDetails;

                if (!_userService.SaveUserProfileSettings(settings, _user))
                    throw new Exception("Error saving user profile settings");

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        private void HandleDetail(ref EUserProfileDetails hiddenDetails, EUserProfileDetails detail, bool isShow)
        {
            var isHidden = hiddenDetails.HasFlag(detail);

            if (isShow && isHidden)
                hiddenDetails &= ~detail;
            else if (!isShow && !isHidden)
                hiddenDetails |= detail;
        }

        #endregion User profile settings

        #region Public user requests

        [HttpPost(UserConstants.TYPE_USER_PROFILE)]
        public async Task<ActionResult> HandleProfileRequest([FromQuery] string operation)
        {
            try
            {
                object? result = null;

                var postParams = new Dictionary<string, string>();
                foreach (var item in Request.Form)
                    postParams[item.Key] = item.Value;

                switch (operation)
                {
                    case UserConstants.OPER_USER_PROFILE_GET:
                        result = GetUserProfile(postParams);
                        if (result == null)
                            throw new Exception("Error getting profile data");
                        break;
                    default:
                        throw new Exception("Error, invalid user profile type");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        public UserProfileJson? GetUserProfile(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetId("id", out var id) || id <= 0)
                    throw new Exception("Error getting id param");

                var userData = _userService.GetUserData(id);
                if (userData == null)
                    throw new Exception("Error getting user data");

                var userProfileSettings = _userService.GetUserProfileSettings(id);

                var imagePath = string.Empty;
                if (!string.IsNullOrWhiteSpace(userProfileSettings.ImageUrl))
                    imagePath = Helper.GetImageUrl($"User_{id}/{userProfileSettings.ImageUrl}");

                var result = new UserProfileJson
                {
                    NameSurname = userData.GetUserFullName(),
                    ImageUrl = imagePath,
                    Details = UserHelper.GetUserDetails(userData, userProfileSettings, _user)
                };

                return result;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        #endregion Public user requests
    }
}
