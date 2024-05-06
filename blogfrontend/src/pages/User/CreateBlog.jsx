// CreateBlogPost.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css';
import { useAuth } from '../../context/auth';

const CreateBlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [auth] = useAuth(); // Use the useAuth hook to access the auth object

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth?.user?.userId; // Access the userId from the auth object
      const response = await axios.post('https://localhost:44385/api/blog/create', {
        title,
        content,
        authorId:userId, // Pass the userId to the backend API
      });
      console.log('Blog post created:', response.data);
      // You can redirect the user to the newly created blog post or another page here
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
       
        <button type="submit" className="submit-btn">Create</button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
