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
    }
}
