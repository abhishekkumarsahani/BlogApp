using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ArpickAPI.Models.Domain
{
    public class DatabaseContext : IdentityDbContext<ApplicationUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options):base(options)
        {

        }

        public DbSet<TokenInfo> TokenInfo { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Comments> CommentPosts { get; set; }


    }
}
