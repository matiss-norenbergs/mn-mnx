using ProtoBuf;

namespace MN_MNX.Server.Models
{
    [ProtoContract]
    public class PostData
    {
        [ProtoMember(1, IsRequired = true)]
        public long Id { get; set; } = 0;

        [ProtoMember(2, IsRequired = true)]
        public string Title { get; set; } = string.Empty;

        [ProtoMember(3, IsRequired = true)]
        public string Content { get; set; } = string.Empty;

        [ProtoMember(4, IsRequired = true)]
        public long CreatorId { get; set; } = 0;

        [ProtoMember(5, IsRequired = true)]
        public DateTime DtuCreatedAt { get; set; } = DateTime.MinValue;

        [ProtoMember(6, IsRequired = true)]
        public DateTime DtuUpdatedAt { get; set; } = DateTime.MinValue;

        [ProtoMember(7, IsRequired = true)]
        public bool IsPublic { get; set; } = false;
    }
}
