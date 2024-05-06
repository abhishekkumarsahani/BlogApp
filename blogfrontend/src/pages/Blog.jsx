// Blog.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css'; // Import your custom CSS file

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page
  const [sortBy, setSortBy] = useState('recency'); // Default sort option

  useEffect(() => {
    // Fetch initial list of blog posts from backend API
    fetchBlogPosts();
  }, [sortBy]);

  const fetchBlogPosts = async () => {
    try {
      // Make API request to fetch blog posts
      const response = await axios.get(`https://localhost:44385/api/blog-posts?sortBy=${sortBy}`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  // Function to handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current posts based on pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="blog-container">
      <h2>Blog Listing</h2>
      {/* Render sorting options */}
      <div className="sort-by">
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recency">Recency</option>
          <option value="popularity">Popularity</option>
          <option value="random">Random</option>
        </select>
      </div>
      {/* Render blog posts */}
      {currentPosts.map((post) => (
        <div key={post.id} className="blog-post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {/* Additional blog post details */}
        </div>
      ))}
      {/* Render pagination controls */}
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={blogPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => paginate(number)} className="page-link" href="!#">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Blog;
