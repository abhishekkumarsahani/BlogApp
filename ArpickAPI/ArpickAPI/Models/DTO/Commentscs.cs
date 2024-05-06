namespace ArpickAPI.Models.DTO
{
    public class Comments
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public string AuthorName { get; set; } 
        public int Post_id { get; set; }

    }
}
