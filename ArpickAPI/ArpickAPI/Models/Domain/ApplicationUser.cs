using Microsoft.AspNetCore.Identity;

namespace ArpickAPI.Models.Domain
{
    public class ApplicationUser: IdentityUser
    {
        public string? Name { get; set; }

    }
}
