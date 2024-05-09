import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Components/Popup/Popop';
import './Blog.css'; // Import CSS for styling
import { useAuth } from '../context/auth';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [upVotes, setUpVotes] = useState([]);
  const [downVotes, setDownVotes] = useState([]);
  const [upVoteCounts, setUpVoteCounts] = useState({});
  const [downVoteCounts, setDownVoteCounts] = useState({});
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [auth] = useAuth(); // Use the useAuth hook to access the auth object

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

  useEffect(() => {
    const fetchUpVotes = async () => {
      try {
        const response = await axios.get('https://localhost:44385/api/upvotes');
        setUpVotes(response.data);
      } catch (error) {
        console.error('Error fetching upvotes:', error);
      }
    };

    fetchUpVotes();
  }, []);

  useEffect(() => {
    const fetchDownVotes = async () => {
      try {
        const response = await axios.get('https://localhost:44385/api/downvotes');
        setDownVotes(response.data);
      } catch (error) {
        console.error('Error fetching downvotes:', error);
      }
    };

    fetchDownVotes();
  }, []);

  // Function to fetch upvotes and count upvotes for each blog post
  const fetchUpVoteCounts = async () => {
    try {
      const response = await axios.get('https://localhost:44385/api/upvotes');
      const counts = {};
      // Count upvotes for each blog post
      response.data.forEach(upvote => {
        const blogId = upvote.blogId;
        counts[blogId] = counts[blogId] ? counts[blogId] + 1 : 1;
      });
      setUpVoteCounts(counts);
    } catch (error) {
      console.error('Error fetching upvotes:', error);
    }
  };

  // Function to fetch downvotes and count downvotes for each blog post
  const fetchDownVoteCounts = async () => {
    try {
      const response = await axios.get('https://localhost:44385/api/downvotes');
      const counts = {};
      // Count upvotes for each blog post
      response.data.forEach(downvote => {
        const blogId = downvote.blogId;
        counts[blogId] = counts[blogId] ? counts[blogId] + 1 : 1;
      });
      setDownVoteCounts(counts);
    } catch (error) {
      console.error('Error fetching upvotes:', error);
    }
  };

  const upVote = async (id, blogTitle, author) => {
    try {
      const userName = auth?.user?.username
      const blogId = id
      const title = blogTitle
      const description = `User: ${userName} upvoted your Blog: ${title}`
      const notificationUser = author
      const upVoteData = {
        userName,
        blogId,
        title,
        description,
        notificationUser
      };

      const response = await axios.post('https://localhost:44385/api/upvotes/create', upVoteData);
      console.log('upvote created:', response.data);

      // After upvoting, fetch upvote counts again
      fetchUpVoteCounts();
    } catch (error) {
      console.error('Error creating upvote:', error);
    }
  }

  const downVote = async (id, blogTitle, author) => {
    try {
      const userName = auth?.user?.username
      const blogId = id
      const title = blogTitle
      const description = `User: ${userName} downvoted your Blog: ${title}`
      const notificationUser = author
      const downVoteData = {
        userName,
        blogId,
        title,
        description,
        notificationUser
      };

      const response = await axios.post('https://localhost:44385/api/downvotes/create', downVoteData);
      console.log('downvote created:', response.data);

      // After upvoting, fetch upvote counts again
      fetchDownVoteCounts();
    } catch (error) {
      console.error('Error creating downvote:', error);
    }
  }


  const upVoteCount = (blogId) => {
    return upVoteCounts[blogId] || 0;
  };

  const downVoteCount = (blogId) => {
    return downVoteCounts[blogId] || 0;
  };

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
            <button className="vote-button" onClick={() => upVote(post.id, post.title, post.authorName)}>Upvote ({upVoteCount(post.id)}) </button>
            <button className="vote-button" onClick={() => downVote(post.id, post.title, post.authorName)}>Downvote ({downVoteCount(post.id)}) </button>
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
