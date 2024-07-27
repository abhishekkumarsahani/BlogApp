using ArpickAPI.Models.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public NotificationsController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/notifications/
        [HttpGet]
        public ActionResult<IEnumerable<Notification>> RetrieveNotifications()
        {
            var notificationsList = FetchNotificationsFromDb();
            if (notificationsList.Count == 0)
            {
                return NotFound();
            }
            return notificationsList;
        }

        private List<Notification> FetchNotificationsFromDb()
        {
            return _dbContext.Notification.ToList();
        }

        // GET: api/notifications/{user}
        [HttpGet("{userId}")]
        public ActionResult<IEnumerable<Notification>> RetrieveUserNotifications(string userId)
        {
            var notificationsForUser = GetNotificationsByUserId(userId);
            if (notificationsForUser.Count == 0)
            {
                return NotFound();
            }
            return notificationsForUser;
        }

        private List<Notification> GetNotificationsByUserId(string userId)
        {
            return _dbContext.Notification.Where(n => n.User == userId).ToList();
        }

        // PUT: api/notifications/Read/{user}
        [HttpPut("Read/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> MarkNotificationsAsRead(string userId)
        {
            var notificationsToMark = RetrieveAndPrepareNotifications(userId);
            if (notificationsToMark.Count == 0)
            {
                return NotFound();
            }

            await MarkAsReadAndSave(notificationsToMark);
            return notificationsToMark;
        }

        private List<Notification> RetrieveAndPrepareNotifications(string userId)
        {
            var notifications = GetNotificationsByUserId(userId);
            foreach (var notification in notifications)
            {
                notification.isRead = true;
            }
            return notifications;
        }

        private async Task MarkAsReadAndSave(List<Notification> notifications)
        {
            _dbContext.Notification.UpdateRange(notifications);
            await _dbContext.SaveChangesAsync();
        }
    }
}