using DBreeze;
using DBreeze.Objects;
using DBreeze.Utils;
using MN_MNX.Server.Models;

namespace MN_MNX.Server.Services
{
    public class PostService
    {
        private static string postTable = "Posts";

        private static byte _primaryIndex = 1;
        private static byte _secondaryIndex = 2;

        readonly DBreezeEngine? postEngine = null;

        public PostService()
        {
            CustomSerializator.ByteArraySerializator = Helper.SerializeProtobuf;
            CustomSerializator.ByteArrayDeSerializator = Helper.DeserializeProtobuf;

            postEngine ??= new DBreezeEngine($"{Environment.CurrentDirectory}/Databases/Posts");
        }

        public long SavePostData(PostData postData, UserData user)
        {
            try
            {
                using (var tran = postEngine.GetTransaction())
                {
                    bool newEntity = postData.Id <= 0;
                    if (newEntity)
                    {
                        postData.Id = tran.ObjectGetNewIdentity<long>(postTable);
                        postData.DtuCreatedAt = DateTime.UtcNow;
                        postData.CreatorId = user.Id;
                    }

                    postData.DtuUpdatedAt = DateTime.UtcNow;

                    var dbObject = new DBreezeObject<PostData>
                    {
                        NewEntity = newEntity,
                        Entity = postData,
                        Indexes = new List<DBreezeIndex>
                        {
                            new DBreezeIndex(_primaryIndex, postData.Id) { PrimaryIndex = true },
                            //new DBreezeIndex(_secondaryIndex, user.Id) { AddPrimaryToTheEnd = true }
                        }
                    };

                    tran.ObjectInsert(postTable, dbObject);

                    tran.Commit();
                }

                return postData.Id;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return -1;
            }
        }

        public List<PostData>? GetPostList(bool onlyPublic = true)
        {
            try
            {
                var postList = new List<PostData>();

                using (var tran = postEngine.GetTransaction())
                {
                    foreach (var row in tran.SelectForward<byte[], byte[]>(postTable))
                    {
                        var obj = row.ObjectGet<PostData>()?.Entity;
                        if (obj != null && (onlyPublic && obj.IsPublic || !onlyPublic))
                            postList.Add(obj);
                    }
                }

                return postList;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        public List<PostData>? GetPostListByUserId(long userId)
        {
            try
            {
                var postList = new List<PostData>();

                using (var tran = postEngine.GetTransaction())
                {
                    foreach (var row in tran.SelectForwardStartFrom<byte[], byte[]>(postTable, _secondaryIndex.ToIndex(userId), true))
                    {
                        var obj = row.ObjectGet<PostData>()?.Entity;
                        if (obj != null)
                            postList.Add(obj);
                    }
                }

                return postList;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        public PostData? GetPostData(long postId)
        {
            try
            {
                var post = new PostData();

                using (var tran = postEngine.GetTransaction())
                {
                    var row = tran.Select<byte[], byte[]>(postTable, _primaryIndex.ToIndex(postId));
                    if (row.Exists)
                        post = row.ObjectGet<PostData>().Entity;
                }

                return post;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        public bool DeletePost(long userId)
        {
            try
            {
                using (var tran = postEngine.GetTransaction())
                {
                    tran.ObjectRemove(postTable, _primaryIndex.ToIndex(userId));

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
