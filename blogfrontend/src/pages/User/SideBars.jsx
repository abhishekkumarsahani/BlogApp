import React from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { IoIosCreate } from "react-icons/io";
import { CiBoxList, CiLogout } from "react-icons/ci";
import { FaUserShield } from "react-icons/fa";

const SideBars = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };
  return (
    <div
      className="sidebar mt-5"
      style={{ backgroundColor: "#181818", height: "93.5vh" }}
    >
      <div
        className="sidebar-brand mb-4 mt-4"
        style={{
          color: "white",
          fontSize: "25px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <FaUserShield
          className="icon_header"
          style={{ height: "50px", width: "50px" }}
        />{" "}
        Dashboard
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link
            to="/dashboard/user/viewProfile"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <IoIosCreate
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>View Profile</label>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link
            to="/dashboard/user/blog/create"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <IoIosCreate
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>Create Blog</label>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link
            to="/dashboard/user/blog/showBlog"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <CiBoxList
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>My Blogs</label>
          </Link>
        </li>
        <li className="sidebar-item">
          <NavLink
            onClick={handleLogout}
            to="/login"
            className="dropdown-item"
            style={{ color: "red" }}
          >
            <CiLogout
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>Logout</label>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBars;
