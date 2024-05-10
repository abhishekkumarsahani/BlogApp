import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "./AdminSideBar";

const PostStats = () => {
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [monthSpecificStats, setMonthSpecificStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:44385/api/admin/dashboard/stats"
        );
        setAllTimeStats(response.data.allTimeStats);
        setMonthSpecificStats(response.data.monthSpecificStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
      <AdminSideBar />
      </div>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          padding: "100px",
        }}
      >
        <div>
          <div>
            <h2>All-Time Stats</h2>
            {allTimeStats && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  flexDirection: "row",
                  gap: "10%",
                }}
              >
                <div
                  className="card"
                  style={{ width: "300px", height: "100px", backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Blog Posts</h5>
                  <p className="text-center mt-2">{allTimeStats.totalBlogPosts}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Upvotes</h5>
                  <p className="text-center mt-2">{allTimeStats.totalUpvotes}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Downvotes</h5>
                  <p className="text-center mt-2">{allTimeStats.totalDownvotes}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Comments</h5>
                  <p className="text-center mt-2">{allTimeStats.totalComments}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Popularity</h5>
                  <p className="text-center mt-2">{allTimeStats.totalPopularity}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10%",
            marginTop: "50px",
          }}
        >
          <div>
            <h2>Month-Specific Stats</h2>
            {monthSpecificStats && (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  flexDirection: "row",
                  gap: "10%",
                }}
              >
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Blog Posts</h5>
                  <p className="text-center mt-2">{monthSpecificStats.totalBlogPosts}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Upvotes</h5>
                  <p className="text-center mt-2">{monthSpecificStats.totalUpvotes}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Downvotes</h5>
                  <p className="text-center mt-2">{monthSpecificStats.totalDownvotes}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Comments</h5>
                  <p className="text-center mt-2">{monthSpecificStats.totalComments}</p>
                </div>
                <div
                  className="card"
                  style={{ width: "300px", height: "100px",  backgroundColor: "rgba(241, 236, 236, 0.8)" }}
                >
                  <h5 className="text-center mt-2">Total Popularity</h5>
                  <p className="text-center mt-2">{monthSpecificStats.totalPopularity}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostStats;
