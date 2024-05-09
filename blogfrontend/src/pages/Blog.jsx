import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Components/Popup/Popop";
import "./Blog.css"; // Import CSS for styling
import { useAuth } from "../context/auth";
import { BiUpvote, BiDownvote, BiCommentDetail } from "react-icons/bi";
import { FaUserSecret } from "react-icons/fa6";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { MdNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [upVotes, setUpVotes] = useState([]);
  const [downVotes, setDownVotes] = useState([]);
  const [upVoteCounts, setUpVoteCounts] = useState({});
  const [downVoteCounts, setDownVoteCounts] = useState({});
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [auth] = useAuth(); // Use the useAuth hook to access the auth object
  const [currentPostId, setCurrentPostId] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(
          `https://localhost:44385/api/blog?pageNumber=${currentPage}&pageSize=${pageSize}`
        );
        setBlogPosts(response.data);
        const totalCount = parseInt(response.headers["x-total-count"], 5);
        setTotalPages(Math.ceil(totalCount / pageSize));
        console.log("Current Page:", currentPage);
        console.log("Page Size:", pageSize);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, [currentPage, pageSize]);

  // Function to handle page change
  const handlePageChange = (page) => {
    console.log("Page clicked:", page);
    if (page === "Previous") {
      setCurrentPage(currentPage - 1); // Decrease page number by 1
    } else if (page === "Next") {
      setCurrentPage(currentPage + 1); // Increase page number by 1
    } else {
      setCurrentPage(page); // Set the page number directly
    }
  };

  useEffect(() => {
    const fetchUpVotes = async () => {
      try {
        const response = await axios.get("https://localhost:44385/api/upvotes");
        setUpVotes(response.data);
        fetchUpVoteCounts();
      } catch (error) {
        console.error("Error fetching upvotes:", error);
      }
    };

    fetchUpVotes();
  }, []);

  useEffect(() => {
    const fetchDownVotes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:44385/api/downvotes"
        );
        setDownVotes(response.data);
        fetchDownVoteCounts();
      } catch (error) {
        console.error("Error fetching downvotes:", error);
      }
    };

    fetchDownVotes();
  }, []);

  // Function to fetch upvotes and count upvotes for each blog post
  const fetchUpVoteCounts = async () => {
    try {
      const response = await axios.get("https://localhost:44385/api/upvotes");
      const counts = {};
      // Count upvotes for each blog post
      response.data.forEach((upvote) => {
        const blogId = upvote.blogId;
        counts[blogId] = counts[blogId] ? counts[blogId] + 1 : 1;
      });
      setUpVoteCounts(counts);
    } catch (error) {
      console.error("Error fetching upvotes:", error);
    }
  };

  // Function to fetch downvotes and count downvotes for each blog post
  const fetchDownVoteCounts = async () => {
    try {
      const response = await axios.get("https://localhost:44385/api/downvotes");
      const counts = {};
      // Count upvotes for each blog post
      response.data.forEach((downvote) => {
        const blogId = downvote.blogId;
        counts[blogId] = counts[blogId] ? counts[blogId] + 1 : 1;
      });
      setDownVoteCounts(counts);
    } catch (error) {
      console.error("Error fetching upvotes:", error);
    }
  };

  const upVote = async (id, blogTitle, author) => {
    try {
      const userName = auth?.user?.username;
      const blogId = id;
      const title = blogTitle;
      const description = `${userName} upvoted your Blog: ${title}`;
      const notificationUser = author;
      const upVoteData = {
        userName,
        blogId,
        title,
        description,
        notificationUser,
      };

      const response = await axios.post(
        "https://localhost:44385/api/upvotes/create",
        upVoteData
      );
      console.log("upvote created:", response.data);

      // After upvoting, fetch upvote counts again
      fetchUpVoteCounts();
      fetchDownVoteCounts();
    } catch (error) {
      console.error("Error creating upvote:", error);
    }
  };

  const downVote = async (id, blogTitle, author) => {
    try {
      const userName = auth?.user?.username;
      const blogId = id;
      const title = blogTitle;
      const description = `${userName} downvoted your Blog: ${title}`;
      const notificationUser = author;
      const downVoteData = {
        userName,
        blogId,
        title,
        description,
        notificationUser,
      };

      const response = await axios.post(
        "https://localhost:44385/api/downvotes/create",
        downVoteData
      );
      console.log("downvote created:", response.data);

      // After upvoting, fetch upvote counts again
      fetchDownVoteCounts();
      fetchUpVoteCounts();
    } catch (error) {
      console.error("Error creating downvote:", error);
    }
  };

  const upVoteCount = (blogId) => {
    return upVoteCounts[blogId] || 0;
  };

  const downVoteCount = (blogId) => {
    return downVoteCounts[blogId] || 0;
  };

  // Function to handle opening the popup
  const handleOpenPopup = (postId) => {
    setShowPopup(true);
    setCurrentPostId(postId);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentPostId(null);
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
            {post.authorName}
          </p>

          <p style={{ fontFamily: "Verdana", fontSize: "25px" }}>
            {post.title}
          </p>
          <p style={{ fontFamily: "Verdana", fontSize: "15px" }}>
            {post.content}
          </p>
          {post.imagePath && (
            <img
              src={post.imagePath}
              alt={post.title}
              style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
          )}

          <div className="vote-buttons">
            <div
              style={{
                border: "0.5px solid black",
                display: "flex",
                flexDirection: "row",
                borderRadius: "20px",
              }}
            >
              <button
                className="btn btn-transparent btu"
                onClick={() => upVote(post.id, post.title, post.authorName)}
              >
                <BiUpvote style={{ height: "22px", width: "22px" }} />{" "}
                {upVoteCount(post.id)}{" "}
              </button>
              <button
                className="btn btn-transparent btd"
                onClick={() => downVote(post.id, post.title, post.authorName)}
              >
                <BiDownvote style={{ height: "22px", width: "22px" }} />{" "}
              </button>
            </div>
            <div style={{ border: "0.5px solid black", borderRadius: "15px" }}>
              <button
                className="btn btn-transparent"
                onClick={() => handleOpenPopup(post.id)}
              >
                <BiCommentDetail style={{ height: "25px", width: "25px" }} />
              </button>{" "}
            </div>
            {/* Open popup on click */}
          </div>
        </div>
      ))}
      {/* Pagination UI */}
      <div className="pagination" style={{ display: "flex", justifyContent: "center"}}>
        <button
          className="btn btn-transparent"
          onClick={() => handlePageChange("Previous")}
          style={{ border: "none" }}
        >
          <MdOutlineNavigateBefore  style={{height: "25px", width: "25px"}}/>
        </button>
        <span style={{ marginLeft: "10px", marginRight: "10px" , marginTop: "6px"}}>
          {currentPage}{" "}
        </span>
        <button
          className="btn btn-transparent"
          onClick={() => handlePageChange("Next")}
          style={{border: "none" }}
        >
          <MdNavigateNext style={{height: "25px", width: "25px"}}/>
        </button>
      </div>
      {/* Render the Popup component if showPopup is true */}
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          onSubmit={handleSubmitComment}
          postId={currentPostId}
        />
      )}
    </div>
  );
};

export default Blog;
