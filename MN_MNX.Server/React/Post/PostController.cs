using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Models;
using MN_MNX.Server.React.Post.Models;
using MN_MNX.Server.Services;

namespace MN_MNX.Server.React.Post
{
    [Route($"api/{PostConstants.OBJECT_POST}")]
    [ApiController]
    public class PostController(PostService postService, UserService userService, UserContext userContext) : ControllerBase
    {
        private readonly PostService _postService = postService;
        private readonly UserService _userService = userService;
        private readonly UserData? _user = userContext.User;

        [Authorize(Roles = "Admin")]
        [HttpPost]
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
                    case PostConstants.TYPE_POST_LIST:
                        result = HandleListRequest(operation, postParams);
                        if (result == null)
                            throw new Exception("Error getting post list data");
                        break;
                    case PostConstants.TYPE_POST_FORM:
                        result = HandleFormRequest(operation, postParams);
                        if (result == null)
                            throw new Exception("Error getting post form data");
                        break;
                    default:
                        throw new Exception("Error, invalid post type");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        #region Admin post list

        private object? HandleListRequest(string operation, Dictionary<string, string> postParams)
        {
            object? result = null;
            try
            {
                switch (operation)
                {
                    case PostConstants.OPER_POST_LIST_GET:
                        result = GetListData();
                        if (result == null)
                            throw new Exception("Error getting post list data");
                        break;
                    case PostConstants.OPER_POST_LIST_DELETE:
                        result = DeletePostData(postParams);
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

        private List<PostListJson>? GetListData(bool onlyPublic = false)
        {
            try
            {
                var postList = _postService.GetPostList(onlyPublic)?.OrderByDescending(x => x.DtuCreatedAt);
                if (postList == null)
                    throw new Exception("Error getting post data");

                var creatorIds = postList.Select(x => x.CreatorId).ToHashSet();

                var postCreatorCollection = _userService.GetUserByUserIdList(creatorIds).ToDictionary(x => x.Key, x => x.Value.GetUserFullName());

                var jsonData = new List<PostListJson>();

                foreach (var post in postList)
                {
                    jsonData.Add(new PostListJson
                    {
                        Id = post.Id.ToString(),
                        Title = post.Title,
                        Content = post.Content,
                        CreatedAt = post.DtuCreatedAt.ToLocalTime().ToString(),
                        UpdatedAt = post.DtuUpdatedAt.ToLocalTime().ToString(),
                        CreatedBy = postCreatorCollection.TryGetValue(post.CreatorId, out var creatorName) ? creatorName : string.Empty,
                        IsPublic = post.IsPublic
                    });
                }

                return jsonData;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        private bool DeletePostData(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetValue("ids", out var tmpStr) || !tmpStr.TryDeserializeJsonIds(out var ids) || !_postService.DeletePosts(ids))
                    throw new Exception("Error deleting posts");

                return true;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return false;
            }
        }

        #endregion Admin post list

        #region Admin post form

        private object? HandleFormRequest(string operation, Dictionary<string, string> postParams)
        {
            object? result = null;
            try
            {
                switch (operation)
                {
                    case PostConstants.OPER_POST_FORM_GET:
                        result = GetFormData(postParams);
                        if (result == null)
                            throw new Exception("Error getting post form data");
                        break;
                    case PostConstants.OPER_POST_FORM_SAVE:
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

        private PostFormJson? GetFormData(Dictionary<string, string> postParams)
        {
            try
            {
                if (!postParams.TryGetValue("id", out var tmpStr) || !long.TryParse(tmpStr, out var id))
                    throw new Exception("Error getting id param");

                var formData = new PostFormJson();
                if (id > 0)
                {
                    var postData = _postService.GetPostData(id);
                    if (postData == null)
                        throw new Exception("Error getting post data");

                    formData = new PostFormJson
                    {
                        Id = postData.Id.ToString(),
                        Title = postData.Title,
                        Content = postData.Content,
                        IsPublic = postData.IsPublic
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

                if (!postParams.TryGetValue("title", out var title) || string.IsNullOrWhiteSpace(title))
                    throw new Exception("Error getting title param");

                if (!postParams.TryGetValue("content", out var content) || string.IsNullOrWhiteSpace(content))
                    throw new Exception("Error getting content param");

                if (!postParams.TryGetValue("isPublic", out tmpStr) || !bool.TryParse(tmpStr, out var isPublic))
                    throw new Exception("Error getting isPublic param");

                var postData = new PostData();
                if (id > 0)
                {
                    postData = _postService.GetPostData(id);
                    if (postData == null)
                        throw new Exception("Error getting post data");
                }
                
                postData.Title = title.Trim();
                postData.Content = content.Trim();
                postData.IsPublic = isPublic;

                var res = _postService.SavePostData(postData, _user);
                if (res <= 0)
                    throw new Exception("Error saving post data");

                return res.ToString();
            }
            catch (Exception ex)
            {
                ex.LogException();
                return null;
            }
        }

        #endregion Admin post form

        #region Public post requests

        [HttpPost(PostConstants.TYPE_POST_PUBLIC)]
        public async Task<ActionResult> HandlePublicRequest([FromQuery] string operation)
        {
            try
            {
                object? result = null;

                switch (operation)
                {
                    case PostConstants.OPER_POST_PUBLIC_GET:
                        result = GetListData(true);
                        if (result == null)
                            throw new Exception("Error getting post list data");
                        break;
                    default:
                        throw new Exception("Error, invalid post type");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        #endregion Public post requests
    }
}
