using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownVotesController : ControllerBase
    {
        private readonly DatabaseContext _context; // Assuming ApplicationDbContext is your EF DbContext

        public DownVotesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/downvotes/
        [HttpGet]
        public ActionResult<IEnumerable<DownVote>> GetDownVotes()
        {
            var downVote = _context.DownVote.ToList();

            if (downVote == null)
            {
                return NotFound();
            }

            return downVote;
        }

        // GET: api/downvotes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DownVote>> GetDownVote(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID provided.");
            }

            try
            {
                var downVote = await _context.DownVote
                    .Where(x => x.BlogId == id)
                    .FirstOrDefaultAsync();

                if (downVote == null)
                {
                    return NotFound(new { message = $"DownVote with ID {id} not found." });
                }

                return Ok(downVote);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/downvotes/create
        [HttpPost("create")]
        public async Task<ActionResult<VoteDTO>> CreateDownVote(VoteDTO downVote)
        {
            if (downVote == null || !ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid downVote data." });
            }

            var downVoteEntity = new DownVote
            {
                BlogId = downVote.BlogId,
                username = downVote.username,
                CreatedAt = DateTime.UtcNow
            };

            var downVoteQuery = from dv in _context.DownVote
                                where dv.BlogId == downVote.BlogId && dv.username == downVote.username
                                select dv;

            bool isExistingDownVote = await downVoteQuery.AnyAsync();

            if (isExistingDownVote)
            {
                return NoContent();
            }

            _context.DownVote.Add(downVoteEntity);

            var upVoteQuery = _context.UpVote
                .Where(uv => uv.BlogId == downVote.BlogId && uv.username == downVote.username);

            if (await upVoteQuery.AnyAsync())
            {
                _context.UpVote.RemoveRange(await upVoteQuery.ToListAsync());
            }

            var notification = new Notification
            {
                Title = downVote.Title,
                Description = downVote.Description,
                isRead = false,
                User = downVote.NotificationUser
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

            return CreatedAtAction(nameof(GetDownVote), new { id = downVoteEntity.Id }, downVote);
        }
    }
}