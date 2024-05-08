import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowBlog.css'; // Import CSS for styling

const ShowBlog = ({ postId }) => {
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`https://localhost:44385/api/blog/${postId}`);
        setBlogPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [postId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!blogPost) {
    return <div className="not-found">Blog post not found</div>;
  }

  return (
    <div className="blog-post-container">
      <h2 className="title">{blogPost.title}</h2>
      <p className="content">{blogPost.content}</p>
      <p className="author">Author: {blogPost.author}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default ShowBlog;
