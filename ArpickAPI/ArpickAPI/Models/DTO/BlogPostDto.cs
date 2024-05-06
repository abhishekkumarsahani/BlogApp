namespace ArpickAPI.Models.DTO
{
    public class BlogPostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string AuthorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImagePath { get; set; } // New property for storing image path
        public IFormFile Image { get; set; }
    }
}
