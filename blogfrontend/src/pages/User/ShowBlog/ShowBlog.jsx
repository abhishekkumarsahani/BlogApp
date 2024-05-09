import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShowBlog.css"; // Import CSS for styling
import "../../Blog.css"; // Import CSS for styling
import { useAuth } from "../../../context/auth";
import SideBars from "../SideBars";
import { useNavigate } from "react-router-dom";
import { FaUserSecret } from "react-icons/fa6";

const ShowBlog = () => {
  const [auth] = useAuth(); // Retrieve the user ID from context
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();

  const [editedPost, setEditedPost] = useState({
    id: "", // Add an ID field to editedPost
    title: "",
    content: "",
    authorName: auth.user.userName,
    imagePath: "",
    authorId: auth.user.userId, // Author ID from auth context
  });

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const userId = auth?.user?.userId;
      try {
        const response = await axios.get(
          `https://localhost:44385/api/blog/user/${userId}`
        );
        setBlogPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [auth?.user?.userId]); // Update the dependency array

  const handleUpdatePost = async (id) => {
    try {
      // Check if the ID in the route matches the ID in the edited post
      if (id !== editedPost.id) {
        console.error(
          "ID in the request body does not match the ID in the route."
        );
        return; // Exit early if IDs don't match
      }

      // Make the request to update the blog post
      await axios.put(
        `https://localhost:44385/api/blog/update/${id}`,
        editedPost
      );

      // If update successful, fetch the updated blog posts
      const response = await axios.get(
        `https://localhost:44385/api/blog/user/${auth?.user?.userId}`
      );
      setBlogPosts(response.data);
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      // Make the request to delete the blog post
      await axios.delete(`https://localhost:44385/api/blog/delete/${id}`);
      // If delete successful, fetch the updated blog posts
      const response = await axios.get(
        `https://localhost:44385/api/blog/user/${auth?.user?.userId}`
      );
      setBlogPosts(response.data);
      navigate("/dashboard/user/blog/showBlog");
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  const handleEditPost = (id, title, content, authorName, imagePath) => {
    setEditingPostId(id);
    setEditedPost({
      id,
      title,
      content,
      authorName,
      imagePath,
      authorId: auth.user.userId,
    });
  };

  const handleSaveEdit = () => {
    handleUpdatePost(editingPostId);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (blogPosts.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "35%" }}>
        <SideBars />
        <div className="not-found" style={{marginTop: "200px", color: "red"}}><p>No blog posts found for this user!</p></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ position: "fixed" }}>
        <SideBars />
      </div>
      <div className="blog-container">
        {blogPosts.map((blogPost) => (
          <div key={blogPost.id} className="blog-post" style={{marginLeft: "100px"}}>
            <p
              className="author"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                padding: "10px",
                textDecoration: "underline",
              }}
            >
              <FaUserSecret style={{ height: "30px", width: "30px" }} />
              {blogPost.authorName}
            </p>
            <p style={{ fontFamily: "Verdana", fontSize: "25px" }}>
              {blogPost.title}
            </p>
            <p style={{ fontFamily: "Verdana", fontSize: "15px" }}>
              {blogPost.content}
            </p>
            {blogPost.imagePath && (
              <img
                className="image"
                src={blogPost.imagePath}
                alt="Blog"
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
              />
            )}
            <div className="actions">
              {editingPostId === blogPost.id ? (
                <>
                  <input
                    className="form-control"
                    id="floatingInput"
                    placeholder="Enter the blog title"
                    type="text"
                    value={editedPost.title}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, title: e.target.value })
                    }
                  />
               
                  <textarea
                  className="form-control"
                    value={editedPost.content}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, content: e.target.value })
                    }
                  />

                  <input
                  className="form-control"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setEditedPost({
                          ...editedPost,
                          imagePath: reader.result,
                        });
                      };
                    }}
                  />
                  <button className="btn btn-success" onClick={handleSaveEdit}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-dark"
                    onClick={() =>
                      handleEditPost(
                        blogPost.id,
                        blogPost.title,
                        blogPost.content,
                        blogPost.authorName,
                        blogPost.imagePath
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePost(blogPost.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowBlog;
