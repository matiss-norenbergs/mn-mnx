namespace MN_MNX.Server.Helpers
{
    public class GenericHelper
    {
        public static Dictionary<string, TimeZoneInfo> GetTimeZoneCollection()
        {
            var timeZones = new Dictionary<string, TimeZoneInfo>();
            try
            {
                foreach (var item in TimeZoneInfo.GetSystemTimeZones())
                    timeZones.Add(item.Id, item);
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return timeZones;
        }
    }
}
