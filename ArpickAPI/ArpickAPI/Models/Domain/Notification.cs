namespace ArpickAPI.Models.Domain
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string User { get; set; }
        public bool isRead { get; set; }
        
    }
}
