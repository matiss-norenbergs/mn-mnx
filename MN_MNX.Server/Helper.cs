namespace MN_MNX.Server
{
    public static class Helper
    {
        public static T DeserializeProtobuf<T>(this byte[] data)
        {
            T ret = default(T);
            using (var ms = new MemoryStream(data))
            {
                ret = ProtoBuf.Serializer.Deserialize<T>(ms);
                ms.Close();
            }
            return ret;
        }

        public static object DeserializeProtobuf(byte[] data, Type T)
        {
            object ret = null;
            using (var ms = new MemoryStream(data))
            {
                ret = ProtoBuf.Serializer.NonGeneric.Deserialize(T, ms);
                ms.Close();
            }
            return ret;
        }

        public static byte[] SerializeProtobuf(this object data)
        {
            byte[] bt = null;
            using (var ms = new MemoryStream())
            {
                ProtoBuf.Serializer.NonGeneric.Serialize(ms, data);
                bt = ms.ToArray();
                ms.Close();
            }
            return bt;
        }

        public static DateTime UtcToLocal(this DateTime dateTime, string defaultTimeZone)
        {
            try
            {
                var tz = TimeZoneInfo.FindSystemTimeZoneById(defaultTimeZone);
                var dateAndOffset = new DateTimeOffset(dateTime, tz.GetUtcOffset(dateTime));

                return dateAndOffset.DateTime.Add(dateAndOffset.Offset);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return dateTime;
            }
        }

        public static void LogException(this Exception ex)
        {
            try
            {
                var logFileName = $"{Environment.CurrentDirectory}/Logs/log_{DateTime.UtcNow:ddMMyyyy}.csv";

                using (StreamWriter sw = new StreamWriter(logFileName, true))
                    sw.WriteLine($"{DateTime.UtcNow.ToLocalTime()};{ex.StackTrace?.Trim() ?? string.Empty};{ex.Message}");
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
            }
        }
    }
}