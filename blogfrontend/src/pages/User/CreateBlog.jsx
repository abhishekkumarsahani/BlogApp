import React, { useState } from "react";
import axios from "axios";
import "./CreateBlog.css";
import { useAuth } from "../../context/auth";
import SideBars from "./SideBars";
import { useNavigate } from "react-router-dom";

const CreateBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // State to store the selected image file
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview URL
  const [auth] = useAuth(); // Use the useAuth hook to access the auth object
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBlogPost = async () => {
    try {
      const userId = auth?.user?.userId; // Access the userId from the auth object
      const authorName = auth?.user?.username;

      // Check if an image is selected
      if (image) {
        // Upload image first
        let formData = new FormData();
        formData.append("image", image); // Use "image" as the key
        const imageResponse = await axios.post(
          "https://localhost:44385/api/Image/upload",
          formData
        );

        if (!imageResponse.data.success) {
          throw new Error(imageResponse.data.message);
        }

        const imagePath = imageResponse.data.imageUrl;

        // Create blog post with image path
        const postData = {
          title,
          content,
          authorId: userId,
          authorName: authorName,
          imagePath: imagePath,
        };

        const response = await axios.post(
          "https://localhost:44385/api/blog/create",
          postData
        );
        console.log("Blog post created:", response.data);
        navigate("/dashboard/user/blog/showBlog");
      } else {
        // Create blog post without image
        const postData = {
          title,
          content,
          authorId: userId,
          authorName: authorName,
        };

        const response = await axios.post(
          "https://localhost:44385/api/blog/create",
          postData
        );
        console.log("Blog post created:", response.data);
        navigate("/dashboard/user/blog/showBlog");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <SideBars />
      </div>
      <div className="create-blog-container">
        <h2>Create New Blog Post</h2>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            required
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your blog content..."
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />{" "}
          {/* Accept only image files */}
          {/* Display image preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                marginTop: "15px",
                marginLeft: "20%",
              }}
              alt="Preview"
              className="image-preview"
            />
          )}
        </div>
        <div
          className="button-group"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <button onClick={handleCreateBlogPost} className="btn btn-dark">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;
