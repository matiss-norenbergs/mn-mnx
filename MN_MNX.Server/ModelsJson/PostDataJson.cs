namespace MN_MNX.Server.ModelsJson
{
    public class PostDataJson
    {
        public string Id { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;

        public string UpdatedAt { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public bool IsPublic { get; set; } = false;
    }
}
