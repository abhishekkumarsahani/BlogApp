using System.ComponentModel.DataAnnotations;

namespace ArpickAPI.Models.DTO
{
    public class UpdateProfileModel
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Email { get; set; }
    }
}
