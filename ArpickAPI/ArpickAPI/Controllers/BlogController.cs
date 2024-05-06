using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        // GET: api/blog
        [HttpGet]
        public ActionResult<IEnumerable<BlogPost>> GetBlogPosts()
        {
            // Retrieve all blog posts without any sorting
            var blogPosts = _context.BlogPosts.ToList();
            return blogPosts;
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
        public async Task<IActionResult> UpdateBlogPost(int id, BlogPost blogPost)
        {
            if (id != blogPost.Id)
            {
                return BadRequest();
            }

            _context.Entry(blogPost).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogPostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
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
