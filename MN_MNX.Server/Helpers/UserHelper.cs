using MN_MNX.Server.Models;
using MN_MNX.Server.ModelsJson;

namespace MN_MNX.Server.Helpers
{
    public class UserHelper
    {
        internal static bool IsValidUserData(UserData userData, bool encryptPassword = true)
        {
            userData.Name = userData.Name.Trim();
            userData.Surname = userData.Surname.Trim();
            userData.Email = userData.Email.Trim();

            if (encryptPassword)
                userData.Password = EncryptPassword(userData.Password);

            if (string.IsNullOrEmpty(userData.Name) || string.IsNullOrEmpty(userData.Surname) || string.IsNullOrEmpty(userData.Email) || (encryptPassword && string.IsNullOrEmpty(userData.Password)))
                return false;

            var timeZoneCollection = GenericHelper.GetTimeZoneCollection();
            if (!timeZoneCollection.TryGetValue(userData.DefaultTimeZone, out var timeZone))
                return false;

            userData.UseDayLightSaving = timeZone.SupportsDaylightSavingTime;

            return true;
        }

        internal static string EncryptPassword(string password)
        {
            byte[] data = System.Text.Encoding.ASCII.GetBytes(password);
            data = System.Security.Cryptography.SHA256.HashData(data);
            var hash = System.Text.Encoding.ASCII.GetString(data);

            return hash;
        }

        internal static UserDataJson GetUserDataJson(UserData data, UserData user)
        {
            var jsonData = new UserDataJson
            {
                Id = data.Id.ToString(),
                Name = data.Name,
                Surname = data.Surname,
                Email = data.Email,
                Role = (int)data.Role,
                CreatedAt = data.DtuCreatedAt.UtcToLocal(user.DefaultTimeZone).ToString("dd/MM/yyyy HH:mm:ss"),
                DefaultTimeZone = data.DefaultTimeZone
            };

            return jsonData;
        }

        internal static List<UserDataJson> GetUserDataJson(List<UserData> data, UserData user)
        {
            var jsonData = new List<UserDataJson>();

            foreach (var item in data)
                jsonData.Add(GetUserDataJson(item, user));

            return jsonData;
        }
    }
}
