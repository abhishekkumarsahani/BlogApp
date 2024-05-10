import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "./AdminDashboard";
import { FaUserSecret } from "react-icons/fa6";

const TopBlogs = () => {
  const [topBlogs, setTopBlogs] = useState([]);

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const response = await axios.get(
          "https://localhost:44385/api/admin/topblogs"
        );
        setTopBlogs(response.data);
      } catch (error) {
        console.error("Error fetching top blogs:", error);
      }
    };

    fetchTopBlogs();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{position: "relative"}}>
        <AdminSideBar />
      </div>
      <div style={{ marginTop: "150px", marginright: "150px" }}>
        <h2 className="text-center">Top Blogs by Likes</h2>
        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", gap: "20px" }}>
          {topBlogs.map((blog) => (
            // <div key={blog.id} style={{ width: "18rem", margin: "10px" }}>
            //   <div className="card">
            //     <div className="card-body">
            //       <h5 className="card-title">{blog.title}</h5>
            //       <p className="card-text">Author: {blog.authorName}</p>
            //       <p className="card-text">Content: {blog.content}</p>
            //     </div>
            //   </div>
            // </div>
            <div key={blog.id} className="blog-post">
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
            {blog.authorName}
          </p>

          <p style={{ fontFamily: "Verdana", fontSize: "25px" }}>
            {blog.title}
          </p>
          <p style={{ fontFamily: "Verdana", fontSize: "15px" }}>
            {blog.content}
          </p>
          {blog.imagePath && (
            <img
              src={blog.imagePath}
              alt={blog.title}
              style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
          )}

          
        </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBlogs;
