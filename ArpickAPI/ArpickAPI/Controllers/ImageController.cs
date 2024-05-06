using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArpickAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly string ImageFolderPath = "upload/images"; // Folder to store uploaded images

        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadImage()
        {
            try
            {
                // Ensure the request contains a file
                if (Request.Form.Files.Count == 0)
                {
                    return BadRequest("No image file provided.");
                }

                var uploadedFile = Request.Form.Files[0]; // Get the uploaded file

                // Check file size
                if (uploadedFile.Length > 3 * 1024 * 1024) // 3 MB maximum
                {
                    return BadRequest("Image size exceeds the limit (3 MB).");
                }

                // Generate a unique file name
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadedFile.FileName);

                // Combine folder path and file name to create the file path
                var filePath = Path.Combine(ImageFolderPath, uniqueFileName);

                // Create the uploads folder if it doesn't exist
                if (!Directory.Exists(ImageFolderPath))
                {
                    Directory.CreateDirectory(ImageFolderPath);
                }

                // Save the file to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }

                // Return the image URL
                var imageUrl = $"{Request.Scheme}://{Request.Host}/{filePath}";
                return Ok(new { success = true, imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
    }
