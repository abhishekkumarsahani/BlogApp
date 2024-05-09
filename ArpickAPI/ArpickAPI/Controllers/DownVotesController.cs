using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            var downVote = _context.DownVote.FirstOrDefault(x => x.BlogId == id);

            if (downVote == null)
            {
                return NotFound();
            }

            return downVote;
        }

        // POST: api/upvotes/create
        [HttpPost("create")]
        public async Task<ActionResult<VoteDTO>> CreateDownVote(VoteDTO downVote)
        {
            DownVote data = new DownVote();
            data.BlogId = downVote.BlogId;
            data.username = downVote.username;

            var exists = _context.DownVote.FirstOrDefault(x => x.BlogId == downVote.BlogId && x.username == downVote.username);
            if (exists != null)
            {
                return NoContent();
            }

            _context.DownVote.Add(data);

            var existsInUpVote = _context.UpVote.FirstOrDefault(x => x.BlogId == downVote.BlogId && x.username == downVote.username);
            if (existsInUpVote != null)
            {
                _context.UpVote.Remove(existsInUpVote);
            }

            //This section will add notifcation
            Notification newNotification = new Notification();
            newNotification.Title = downVote.Title;
            newNotification.Description = downVote.Description;
            newNotification.isRead = false;
            newNotification.User = downVote.NotificationUser;

            _context.Notification.Add(newNotification);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDownVote), new { id = data.Id }, downVote);

        }
    }
}
