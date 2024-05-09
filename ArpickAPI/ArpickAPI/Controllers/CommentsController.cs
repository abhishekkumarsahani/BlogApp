using Microsoft.AspNetCore.Mvc;
using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ArpickAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly DatabaseContext _context; // Assuming ApplicationDbContext is your EF DbContext

        public CommentsController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Comments>> AddComment(Comments comment)
        {
            try
            {
               
                // Add the comment to the database
                _context.CommentPosts.Add(comment);
                await _context.SaveChangesAsync();

                // Return the newly created comment
                return Ok(comment);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error occurred while adding comment: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        /*  [HttpGet("Viewcomments")]
          public async Task<ActionResult<IEnumerable<Comments>>> GetComments()
          {       
              try
              {
                  // Retrieve all comments from the database
                  var comments = await _context.CommentPosts.ToListAsync();

                  // Return the comments
                  return Ok(comments);
              }
              catch (Exception ex)
              {
                  // Log the exception
                  Console.WriteLine($"Error occurred while retrieving comments: {ex}");
                  return StatusCode(500, "Internal server error");
              }
          }*/
        [HttpGet("Viewcomments")]
        public async Task<ActionResult<IEnumerable<Comments>>> GetComments([FromQuery] int Post_id)
        {
            try
            {
                // Retrieve comments for the specified post_id from the database
                var comments = await _context.CommentPosts
                    .Where(c => c.Post_id == Post_id)
                    .ToListAsync();

                // Return the comments
                return Ok(comments);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error occurred while retrieving comments: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }




    }
}
