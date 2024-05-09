import React from "react";
import { Link } from "react-router-dom";
import "../User/UserDashboard.css";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { IoIosCreate } from "react-icons/io";
import { CiBoxList, CiLogout } from "react-icons/ci";
import { FaUserShield } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
const AdminSideBar = () => {
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
          style={{ height: "30px", width: "30px" }}
        />{" "}
        Admin
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link
            to="/dashboard/admin"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <MdOutlineDashboard
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>Dashboard</label>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link
            to="/dashboard/admin/addadmin"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <IoIosCreate
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>Add Admin</label>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link
            to="/dashboard/admin/stats"
            className="sidebar-link"
            style={{ color: "white" }}
          >
            <IoIosCreate
              style={{ width: "25px", height: "25px", marginBottom: "5px" }}
            />{" "}
            <label style={{ marginLeft: "20px" }}>Post stats</label>
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

export default AdminSideBar;
