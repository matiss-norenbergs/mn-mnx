namespace MN_MNX.Server.React.User.Models
{
    public class UserProfileJson
    {
        public string NameSurname { get; set; } = string.Empty;

        public List<UserProfileDetailsJson> Details { get; set; } = new List<UserProfileDetailsJson>();

        public string ImageUrl { get; set; } = string.Empty;
    }

    public class UserProfileDetailsJson
    {
        public string Value { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public List<string> Icon { get; set; } = new List<string>();
    }
}
