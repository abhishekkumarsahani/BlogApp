using ArpickAPI.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly DatabaseContext _context; // Assuming ApplicationDbContext is your EF DbContext

        public NotificationsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/notifications/
        [HttpGet]
        public ActionResult<IEnumerable<Notification>> GetNotifications()
        {
            var notifications = _context.Notification.ToList();

            if (notifications == null)
            {
                return NotFound();
            }

            return notifications;
        }

        // GET: api/notifications/user}
        [HttpGet("{user}")]
        public ActionResult<IEnumerable<Notification>> GetNotification(string user)
        {
            var notification = _context.Notification.Where(x => x.User == user).ToList();

            if (notification == null)
            {
                return NotFound();
            }

            return notification;
        }

        // GET: api/notifications/}
        [HttpGet("Read/{user}")]
        [ActionName("Read")]
        public async Task<ActionResult<IEnumerable<Notification>>> Read(string user)
        {
            var notifications = _context.Notification.Where(x => x.User == user).ToList();

            if (notifications == null)
            {
                return NotFound();
            }

            foreach ( var notification in notifications )
            {
                notification.isRead = true;
                _context.Notification.Update(notification);
            }

            await _context.SaveChangesAsync();

            return notifications;
        }



    }
}
