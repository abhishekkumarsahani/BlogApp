using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpVotesController : ControllerBase
    {
        private readonly DatabaseContext _context; // Assuming ApplicationDbContext is your EF DbContext

        public UpVotesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/upvotes/
        [HttpGet]
        public ActionResult<IEnumerable<UpVote>> GetUpVotes()
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
        public async Task<ActionResult<UpVote>> GetUpVote(int id)
        {
            var upVote = _context.UpVote.FirstOrDefault( x => x.BlogId == id);

            if (upVote == null)
            {
                return NotFound();
            }

            return upVote;
        }

        // POST: api/upvotes/create
        [HttpPost("create")]
        public async Task<ActionResult<VoteDTO>> CreateUpVote(VoteDTO upVote)
        {
            UpVote data = new UpVote();
            data.BlogId = upVote.BlogId;
            data.username = upVote.username;
            data.CreatedAt = DateTime.Now;


            var exists = _context.UpVote.FirstOrDefault(x => x.BlogId == upVote.BlogId && x.username == upVote.username);
            if (exists != null) { 
                return NoContent();
            }

            _context.UpVote.Add(data);

            var existsInDownVote = _context.DownVote.FirstOrDefault(x => x.BlogId == upVote.BlogId && x.username == upVote.username);
            if (existsInDownVote != null)
            {
                _context.DownVote.Remove(existsInDownVote);
            }

            //This section will add notifcation
            Notification newNotification = new Notification();
            newNotification.Title = upVote.Title;
            newNotification.Description = upVote.Description;
            newNotification.isRead = false;
            newNotification.User = upVote.NotificationUser;

            _context.Notification.Add(newNotification);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUpVote), new { id = data.Id }, upVote);
        
        }
    }
}
