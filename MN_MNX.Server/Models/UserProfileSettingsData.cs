using ProtoBuf;

namespace MN_MNX.Server.Models
{
    [ProtoContract]
    public class UserProfileSettingsData
    {
        [ProtoMember(1, IsRequired = true)]
        public int HiddenProfileDetails { get; set; } = (int)EUserProfileDetails.None;

        [ProtoMember(2, IsRequired = true)]
        public string ImageUrl { get; set; } = string.Empty;
    }

    [Flags]
    public enum EUserProfileDetails
    {
        None = 0,
        FullName = 1,
        Email = 2,
        Birthday = 4,
        Role = 8
    }
}
