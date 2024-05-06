import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul className="sidebar-menu">
        <li><Link to="/dashboard/user/blog/create" className="sidebar-link">Create Blog</Link></li>
        <li><Link to="/dashboard/blog/posts" className="sidebar-link">My Blog Posts</Link></li>
      </ul>
    </div>
  );
};

export default UserDashboard;
