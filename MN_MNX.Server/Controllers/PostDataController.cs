using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Models;
using MN_MNX.Server.ModelsJson;
using MN_MNX.Server.Services;

namespace MN_MNX.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostDataController(PostService postService, UserService userService, UserContext userContext) : ControllerBase
    {
        private readonly PostService _postService = postService;
        private readonly UserService _userService = userService;

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult<IEnumerable<PostDataJson>> Get()
        {
            try
            {
                var jsonData = GetPostDataJson(false);
                if (jsonData == null)
                    throw new Exception("Error getting post json data");

                return jsonData;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        [HttpGet("public")]
        public ActionResult<IEnumerable<PostDataJson>> GetPublic()
        {
            try
            {
                var jsonData = GetPostDataJson();
                if (jsonData == null)
                    throw new Exception("Error getting post json data");

                return jsonData;
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public ActionResult<UserData> Post([FromBody] PostData postData)
        {
            try
            {
                if (postData.Id > 0)
                {
                    var prevPostData = _postService.GetPostData(postData.Id);
                    if (prevPostData == null)
                        throw new Exception("Error getting post data!");
                }

                var resp = _postService.SavePostData(new PostData
                {
                    Title = $"Test title {DateTime.UtcNow.Ticks}",
                    Content = $"Test content",
                    IsPublic = true
                }, userContext.User);

                if (resp <= 0)
                    return BadRequest();

                return Ok(postData);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public ActionResult Delete(long id)
        {
            try
            {
                var response = _postService.DeletePost(id);
                if (!response)
                    throw new Exception("Error deleting post data!");

                return NoContent();
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }

        private List<PostDataJson>? GetPostDataJson(bool onlyPublic = true)
        {
            try
            {
                var postList = _postService.GetPostList(onlyPublic)?.OrderByDescending(x => x.DtuCreatedAt);
                if (postList == null)
                    throw new Exception("Error getting post data");

                var creatorIds = postList.Select(x => x.CreatorId).ToHashSet();

                var postCreatorCollection = _userService.GetUserByUserIdList(creatorIds).ToDictionary(x => x.Key, x => x.Value.GetUserFullName());

                var jsonData = new List<PostDataJson>();

                foreach (var post in postList)
                {
                    jsonData.Add(new PostDataJson
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
    }
}
