namespace MN_MNX.Server.React.Post.Models
{
    public class PostFormJson
    {
        public string Id { get; set; } = "0";

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public bool IsPublic { get; set; } = false;
    }
}
