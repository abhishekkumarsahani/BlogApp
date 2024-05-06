namespace ArpickAPI.Models.DTO
{
    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImagePath { get; set; } // New property for storing image path
        public string AuthorId { get; set; } // Assuming you have a user ID for the author
        public string AuthorName { get; set; } // Assuming you have a user ID for the author
    }

}
