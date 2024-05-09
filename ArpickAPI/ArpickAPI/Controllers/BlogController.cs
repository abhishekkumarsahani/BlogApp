using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace ArpickAPI.Controllers
{
    // BlogController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly DatabaseContext _context; // Assuming ApplicationDbContext is your EF DbContext

        public BlogController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/blog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(int id)
        {
            var blogPost = await _context.BlogPosts.FindAsync(id);

            if (blogPost == null)
            {
                return NotFound();
            }

            return blogPost;
        }
        [HttpGet]
        public ActionResult<IEnumerable<BlogPost>> GetBlogPosts(int pageNumber = 1, int pageSize = 5)
        {
            var totalBlogs = _context.BlogPosts.Count();

            var totalpgs = Math.Ceiling((decimal)totalBlogs / pageSize);


            var blogPosts = _context.BlogPosts
                                 .Skip((pageNumber - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToList();

            Response.Headers.Add("X-Total-Count", totalBlogs.ToString());

            return blogPosts;
        }

        // GET: api/blog/user/{userId}
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<BlogPost>> GetBlogPostsForUser(string userId)
        {
            // Retrieve all blog posts for the specified user ID
            var blogPostsForUser = _context.BlogPosts.Where(post => post.AuthorId == userId).ToList();
            return blogPostsForUser;
        }



        // POST: api/blog/create
        [HttpPost("create")]
        public async Task<ActionResult<BlogPost>> CreateBlogPost(BlogPost blogPost)
        {
            blogPost.CreatedAt = DateTime.Now;

            _context.BlogPosts.Add(blogPost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.Id }, blogPost);
        }

        // PUT: api/blog/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBlogPost(int id, BlogPost updatedBlogPost)
        {
            if (id != updatedBlogPost.Id)
            {
                return BadRequest("ID in the request body does not match the ID in the route.");
            }

            // Check if the blog post exists
            var existingBlogPost = await _context.BlogPosts.FindAsync(id);
            if (existingBlogPost == null)
            {
                return NotFound("Blog post not found.");
            }

            existingBlogPost.Title = updatedBlogPost.Title;
            existingBlogPost.Content = updatedBlogPost.Content;
            existingBlogPost.CreatedAt = DateTime.Now;
            existingBlogPost.ImagePath = updatedBlogPost.ImagePath;
            existingBlogPost.AuthorId = updatedBlogPost.AuthorId;
            existingBlogPost.AuthorName = updatedBlogPost.AuthorName;
            // Save changes to the database
            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Update successful
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogPostExists(id))
                {
                    return NotFound("Blog post not found.");
                }
                else
                {
                    throw;
                }
            }
        }


        // DELETE: api/blog/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            var blogPost = await _context.BlogPosts.FindAsync(id);
            if (blogPost == null)
            {
                return NotFound();
            }

            _context.BlogPosts.Remove(blogPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BlogPostExists(int id)
        {
            return _context.BlogPosts.Any(e => e.Id == id);
        }
    }

}
