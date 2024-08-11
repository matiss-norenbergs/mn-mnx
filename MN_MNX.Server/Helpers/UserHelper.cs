using MN_MNX.Server.Models;
using MN_MNX.Server.React.User.Models;

namespace MN_MNX.Server.Helpers
{
    public class UserHelper
    {
        internal static string EncryptPassword(string password)
        {
            byte[] data = System.Text.Encoding.ASCII.GetBytes(password.Trim());
            data = System.Security.Cryptography.SHA256.HashData(data);
            var hash = System.Text.Encoding.ASCII.GetString(data);

            return hash;
        }

        internal static Dictionary<EUserProfileDetails, (string, List<string>)> UserProfileDetailsCollection = new Dictionary<EUserProfileDetails, (string, List<string>)>
        {
            { EUserProfileDetails.FullName, ("Full name", new List<string> { "far", "user" }) },
            { EUserProfileDetails.Email, ("Email", new List<string> { "far", "envelope" }) },
            { EUserProfileDetails.Birthday, ("Birthday", new List<string> { "fas", "fa-cake-candles" }) },
            { EUserProfileDetails.Role, ("Role (Private)", new List<string> { "fas", "fa-id-badge" }) }
        };

        internal static List<UserProfileDetailsJson> GetUserDetails(UserData user, UserProfileSettingsData settings, UserData requestUser)
        {
            var visibleDetails = new List<UserProfileDetailsJson>();
            try
            {
                var isOwnDetails = requestUser?.Id == user.Id;
                var isAdmin = requestUser?.Role == EUserRole.Admin;
                var hiddenDetails = (EUserProfileDetails)settings.HiddenProfileDetails;

                foreach (var detail in UserProfileDetailsCollection)
                {
                    var value = string.Empty;

                    switch (detail.Key)
                    {
                        case EUserProfileDetails.FullName:
                            value = user.GetUserFullName();
                            break;
                        case EUserProfileDetails.Email:
                            if (isOwnDetails || isAdmin)
                                value = user.Email;
                            break;
                        case EUserProfileDetails.Birthday:
                            value = user.DtBirthday?.ToLocalTime().ToString("dd/MM/yyyy") ?? string.Empty;
                            break;
                        case EUserProfileDetails.Role:
                            if (isAdmin)
                                value = user.Role.ToString();
                            break;
                    }

                    if ((string.IsNullOrWhiteSpace(value) && !isAdmin) || (!isOwnDetails && !isAdmin && hiddenDetails.HasFlag(detail.Key)))
                        continue;

                    var description = detail.Value.Item1;
                    if (hiddenDetails.HasFlag(detail.Key))
                        description += " (Private)";

                    visibleDetails.Add(new UserProfileDetailsJson
                    {
                        Value = value,
                        Description = description,
                        Icon = detail.Value.Item2
                    });
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return visibleDetails;
        }
    }
}
