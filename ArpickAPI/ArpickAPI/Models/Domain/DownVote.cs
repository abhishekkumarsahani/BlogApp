namespace ArpickAPI.Models.Domain
{
    public class DownVote
    {
        public int Id { get; set; }

        public int BlogId { get; set; }

        public string username { get; set; }
        public DateTime? CreatedAt { get; set; }

    }
}
