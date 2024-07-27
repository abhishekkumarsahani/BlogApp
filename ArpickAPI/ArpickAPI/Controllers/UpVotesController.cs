using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpVotesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UpVotesController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UpVote>> RetrieveAllUpVotes()
        {
            var upVote = _context.UpVote.ToList();

            if (upVote == null)
            {
                return NotFound();
            }

            return upVote;
        }

        // GET: api/upvotes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UpVote>> RetrieveUpVoteById(int id)
        {
            try
            {
                // Use async method for better performance
                var upVote = await _context.UpVote
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.BlogId == id);

                if (upVote == null)
                {
                    return NotFound(new { message = $"No upvote found with BlogId: {id}" });
                }

                return Ok(upVote);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/upvotes/create
        [HttpPost("create")]
        public async Task<ActionResult<VoteDTO>> AddNewUpVote(VoteDTO upVote)
        {
            if (upVote == null || !ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid upVote data." });
            }

            var upVoteEntity = new UpVote
            {
                BlogId = upVote.BlogId,
                username = upVote.username,
                CreatedAt = DateTime.UtcNow
            };

            var upVoteQuery = from uv in _context.UpVote
                              where uv.BlogId == upVote.BlogId && uv.username == upVote.username
                              select uv;

            bool isExistingUpVote = await upVoteQuery.AnyAsync();

            if (isExistingUpVote)
            {
                return NoContent();
            }

            _context.UpVote.Add(upVoteEntity);

            var downVoteQuery = _context.DownVote
                .Where(dv => dv.BlogId == upVote.BlogId && dv.username == upVote.username);

            if (await downVoteQuery.AnyAsync())
            {
                _context.DownVote.RemoveRange(await downVoteQuery.ToListAsync());
            }

            var notification = new Notification
            {
                Title = upVote.Title,
                Description = upVote.Description,
                isRead = false,
                User = upVote.NotificationUser
            };

            _context.Notification.Add(notification);

            try
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();

                var saveResult = await _context.SaveChangesAsync();

                if (saveResult > 0)
                {
                    await transaction.CommitAsync();
                }
                else
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, "No changes were made to the database.");
                }
            }
            catch (Exception ex)
            {
                await _context.Database.RollbackTransactionAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return CreatedAtAction(nameof(RetrieveUpVoteById), new { id = upVoteEntity.Id }, upVote);
        }
    }
}