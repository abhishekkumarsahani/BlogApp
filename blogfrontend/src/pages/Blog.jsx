import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Components/Popup/Popop';
import './Blog.css'; // Import CSS for styling

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get('https://localhost:44385/api/blog');
        setBlogPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  // Function to handle opening the popup
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Function to handle submitting the comment
  const handleSubmitComment = () => {
    // Add your logic to submit the comment here
    // For example, you can call an API to save the comment
    // Then close the popup
    handleClosePopup();
  };

  return (
    <div className="blog-container">
      <h2>Blog Posts</h2>
      {blogPosts.map((post) => (
        <div key={post.id} className="blog-post">
          {post.imagePath && <img src={post.imagePath} alt={post.title} />}
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p className="author">Author: {post.authorName}</p>
          <div className="vote-buttons">
            <button className="vote-button">Upvote</button>
            <button className="vote-button">Downvote</button>
            <button className="vote-button" onClick={handleOpenPopup}>Comment</button> {/* Open popup on click */}
          </div>
        </div>
      ))}
      {/* Render the Popup component if showPopup is true */}
      {showPopup && <Popup onClose={handleClosePopup} onSubmit={handleSubmitComment} />}
    </div>
  );
};

export default Blog;
