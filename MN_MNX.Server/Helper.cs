using DBreeze.Utils;
using System.Text.Json;

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

        public static bool TryDeserializeJson<T>(this string item, out T? result)
        {
            try
            {
                result = JsonSerializer.Deserialize<T>(item);

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                result = default(T);
                return false;
            }
        }

        public static bool TryDeserializeJsonIds(this string idListString, out HashSet<long> ids)
        {
            ids = new HashSet<long>();
            try
            {
                if (!idListString.TryDeserializeJson<List<string>>(out var stringIds))
                    return false;

                foreach (var stringId in stringIds)
                {
                    if (!long.TryParse(stringId, out var id))
                        throw new Exception("Error parsing string id");

                    ids.Add(id);
                }

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return false;
            }
        }

        public static bool TryGetIdList(this Dictionary<string, string> pP, string propName, out HashSet<long> idList, bool isRequired = false)
        {
            idList = new HashSet<long>();
            try
            {
                if (!pP.TryGetValue(propName, out var idListString) || !idListString.TryDeserializeJson<List<string>>(out var stringIds) || stringIds == null)
                    return false;

                foreach (var stringId in stringIds)
                {
                    if (!long.TryParse(stringId, out var id))
                        throw new Exception("Error parsing string id");

                    idList.Add(id);
                }

                if (isRequired && idList.Count <= 0)
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return false;
            }
        }

        public static bool TryGetId(this Dictionary<string, string> pP, string propName, out long id)
        {
            id = default;

            return pP.TryGetValue(propName, out var tmpStr) && long.TryParse(tmpStr, out id);
        }

        public static bool TryGetBool(this Dictionary<string, string> pP, string propName, out bool boolVal)
        {
            boolVal = default;

            return pP.TryGetValue(propName, out var tmpStr) && bool.TryParse(tmpStr, out boolVal);
        }

        public static bool TryGetString(this Dictionary<string, string> pP, string propName, out string stringVal)
        {
            if (pP.TryGetValue(propName, out stringVal) && !string.IsNullOrWhiteSpace(stringVal))
            {
                stringVal = stringVal.Trim();
                return true;
            }
            else
            {
                return false;
            }
        }

        //private static bool TryGetEnum<TEnum>(this Dictionary<string, string> pP, string propName, out TEnum enumValue) where TEnum : Enum
        //{
        //    enumValue = default(TEnum);

        //    return pP.TryGetValue(propName, out var tmpStr) && Enum.TryParse(tmpStr, out enumValue);
        //}

        internal static string GetImageUrl(string imageName)
        {
            var escapedImageName = Uri.EscapeDataString(imageName);

            return $"/api/public/image?ticks={DateTime.UtcNow.Ticks}&image={escapedImageName}";
        }
    }
}