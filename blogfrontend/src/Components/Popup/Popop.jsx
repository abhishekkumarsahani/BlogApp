import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Popup.css"; // Import CSS for styling
import { useAuth } from "../../context/auth";
import { FaUserSecret } from "react-icons/fa6";

const Popup = ({ onClose, postId }) => {
  const [auth] = useAuth();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments for the specific post ID
        const response = await axios.get(
          `https://localhost:44385/api/comments/viewcomments?Post_id=${postId}`
        );

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments. Please try again later.");
      }
    };

    fetchComments();
  }, [postId]); // Fetch comments whenever postId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make POST request to add comment
      const authorName = auth?.user?.username;
      const response = await axios.post(
        "https://localhost:44385/api/comments/add",
        {
          comment: comment,
          authorName: authorName,
          post_id: postId,
        }
      );
      console.log("Comment added:", response.data);
      onClose();
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Comments</h2>
        <div
          className="comments-container"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div
                className="us_com mb-2"
                style={{
                  background: "rgba(241, 236, 236, 0.8)",
                  padding: "3%",
                  borderRadius: "15px",
                }}
              >
                <p
                  style={{
                    textDecoration: "underline",
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  <FaUserSecret style={{ height: "25px", width: "25px" }} />
                  {comment.authorName}
                </p>
                <p style={{fontFamily: "Verdana", fontSize: "14px", fontStyle: "italic"}}>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Add your comment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="buttons">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Adding..." : "Submit"}
            </button>
            <button
              className="close-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
