using ArpickAPI.Models.Domain;
using ArpickAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ArpickAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AdminController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/admin/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var allTimeStats = await GetAllTimeStats();
            var monthSpecificStats = await GetMonthSpecificStats();


            return Ok(new
            {
                AllTimeStats = allTimeStats,
                MonthSpecificStats = monthSpecificStats
            });
        }

        private async Task<object> GetAllTimeStats()
        {
            var allTimeCount = await _context.BlogPosts.CountAsync();
            var allTimeUpvotes = await _context.UpVote.CountAsync();
            var allTimeDownvotes = await _context.DownVote.CountAsync();
            var allTimeComments = await _context.CommentPosts.CountAsync();

            var allTimePopularity = CalculatePopularity(allTimeUpvotes, allTimeDownvotes, allTimeComments);

            return new
            {
                TotalBlogPosts = allTimeCount,
                TotalUpvotes = allTimeUpvotes,
                TotalDownvotes = allTimeDownvotes,
                TotalComments = allTimeComments,
                TotalPopularity = allTimePopularity
            };
        }

        private async Task<object> GetMonthSpecificStats()
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var monthCount = await _context.BlogPosts
                .Where(post => post.CreatedAt >= startDate && post.CreatedAt <= endDate)
                .CountAsync();

            var monthUpvotes = await _context.UpVote
                .Where(upvote => upvote.CreatedAt >= startDate && upvote.CreatedAt <= endDate)
                .CountAsync();

            var monthDownvotes = await _context.DownVote
                .Where(downvote => downvote.CreatedAt >= startDate && downvote.CreatedAt <= endDate)
                .CountAsync();

            var monthComments = await _context.CommentPosts
                .Where(comment => comment.CreatedAt >= startDate && comment.CreatedAt <= endDate)
                .CountAsync();

            var monthPopularity = CalculatePopularity(monthUpvotes, monthDownvotes, monthComments);

            return new
            {
                TotalBlogPosts = monthCount,
                TotalUpvotes = monthUpvotes,
                TotalDownvotes = monthDownvotes,
                TotalComments = monthComments,
                TotalPopularity = monthPopularity
            };
        }

        private int CalculatePopularity(int upvotes, int downvotes, int comments)
        {
            const int upvoteWeightage = 2;
            const int downvoteWeightage = -1;
            const int commentWeightage = 1;

            return (upvoteWeightage * upvotes) + (downvoteWeightage * downvotes) + (commentWeightage * comments);
        }

        [HttpGet("topblogs")]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetTopBlogsByLikes()
        {
            var top3Blogs = await _context.UpVote
                .GroupBy(upvote => upvote.BlogId)
                .Select(group => new { BlogId = group.Key, Likes = group.Count() })
                .OrderByDescending(blog => blog.Likes)
                .Take(3)
                .ToListAsync();

            var blogIds = top3Blogs.Select(blog => blog.BlogId);

            // Fetch the details of the top 3 blogs
            var top3BlogPosts = await _context.BlogPosts
                .Where(blog => blogIds.Contains(blog.Id))
                .ToListAsync();

            return top3BlogPosts;
        }
    }
}
