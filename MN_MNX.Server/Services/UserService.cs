using DBreeze.Objects;
using DBreeze.Utils;
using DBreeze;
using MN_MNX.Server.Models;
using MN_MNX.Server.Helpers;

namespace MN_MNX.Server.Services
{
    public class UserService
    {
        private static string userTable = "Users";

        private static byte _primaryIndex = 1;

        readonly DBreezeEngine? userEngine = null;

        public UserService()
        {
            CustomSerializator.ByteArraySerializator = Helper.SerializeProtobuf;
            CustomSerializator.ByteArrayDeSerializator = Helper.DeserializeProtobuf;

            userEngine ??= new DBreezeEngine($"{Environment.CurrentDirectory}/Databases/Users");

            InitUserSetup();
        }

        private void InitUserSetup()
        {
            var users = GetUserList();
            if (users == null || users.Count != 0)
                return;

            var adminUser = new UserData
            {
                Name = "Administrator",
                Surname = "",
                Email = "admin",
                Password = UserHelper.EncryptPassword("1"),
                Role = EUserRole.Admin
            };

            SaveUserData(adminUser);
        }

        public List<UserData>? GetUserList()
        {
            try
            {
                var userList = new List<UserData>();

                using (var tran = userEngine.GetTransaction())
                {
                    foreach (var row in tran.SelectForward<byte[], byte[]>(userTable))
                    {
                        var obj = row.ObjectGet<UserData>()?.Entity;
                        if (obj != null)
                            userList.Add(obj);
                    }
                }

                return userList;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        public Dictionary<long, UserData> GetUserByUserIdList(HashSet<long> userIds)
        {
            var userCollection = new Dictionary<long, UserData>();
            try
            {
                if (userIds.Count == 0)
                    return userCollection;

                using (var tran = userEngine.GetTransaction())
                {
                    foreach (var userId in userIds)
                    {
                        var row = tran.Select<byte[], byte[]>(userTable, _primaryIndex.ToIndex(userId));
                        if (row.Exists)
                            userCollection[userId] = row.ObjectGet<UserData>().Entity;
                    }
                }
            }
            catch (Exception ex)
            {
                ex.LogException();
            }
            return userCollection;
        }

        public Dictionary<string, UserData> GetUserCollectionByEmail()
        {
            try
            {
                var userList = GetUserList() ?? [];

                return userList.ToDictionary(x => x.Email, x => x);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return [];
            }
        }

        public Dictionary<long, UserData> GetUserCollectionById()
        {
            try
            {
                var userList = GetUserList() ?? [];

                return userList.ToDictionary(x => x.Id, x => x);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return [];
            }
        }

        public UserData? GetUserData(long userId)
        {
            try
            {
                var user = new UserData();

                using (var tran = userEngine.GetTransaction())
                {
                    var row = tran.Select<byte[], byte[]>(userTable, _primaryIndex.ToIndex(userId));
                    if (row.Exists)
                        user = row.ObjectGet<UserData>().Entity;
                }

                return user;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        public long SaveUserData(UserData userData)
        {
            try
            {
                using (var tran = userEngine.GetTransaction())
                {
                    bool newEntity = userData.Id <= 0;
                    if (newEntity)
                    {
                        userData.Id = tran.ObjectGetNewIdentity<long>(userTable);
                        userData.DtuCreatedAt = DateTime.UtcNow;
                    }

                    var dbObject = new DBreezeObject<UserData>
                    {
                        NewEntity = newEntity,
                        Entity = userData,
                        Indexes = new List<DBreezeIndex>
                        {
                            new DBreezeIndex(_primaryIndex, userData.Id) { PrimaryIndex = true }
                        }
                    };

                    tran.ObjectInsert(userTable, dbObject);

                    tran.Commit();
                }

                return userData.Id;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return -1;
            }
        }

        public bool DeleteUser(long userId)
        {
            try
            {
                using (var tran = userEngine.GetTransaction())
                {
                    tran.ObjectRemove(userTable, _primaryIndex.ToIndex(userId));

                    tran.Commit();
                }

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return false;
            }
        }
    }
}
