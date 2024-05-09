import React, { useState, useEffect } from "react";
import axios from "axios";

const PostStats = () => {
  const [allTimeStats, setAllTimeStats] = useState(null);
  const [monthSpecificStats, setMonthSpecificStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:44385/api/admin/dashboard/stats");
        setAllTimeStats(response.data.AllTimeStats);
        setMonthSpecificStats(response.data.MonthSpecificStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>All-Time Stats</h2>
      {allTimeStats && (
        <div>
          <p>Total Blog Posts: {allTimeStats.TotalBlogPosts}</p>
          <p>Total Upvotes: {allTimeStats.TotalUpvotes}</p>
          <p>Total Downvotes: {allTimeStats.TotalDownvotes}</p>
          <p>Total Comments: {allTimeStats.TotalComments}</p>
          <p>Total Popularity: {allTimeStats.TotalPopularity}</p>
        </div>
      )}
      <h2>Month-Specific Stats</h2>
      {monthSpecificStats && (
        <div>
          <p>Total Blog Posts: {monthSpecificStats.TotalBlogPosts}</p>
          <p>Total Upvotes: {monthSpecificStats.TotalUpvotes}</p>
          <p>Total Downvotes: {monthSpecificStats.TotalDownvotes}</p>
          <p>Total Comments: {monthSpecificStats.TotalComments}</p>
          <p>Total Popularity: {monthSpecificStats.TotalPopularity}</p>
        </div>
      )}
    </div>
  );
};

export default PostStats;
