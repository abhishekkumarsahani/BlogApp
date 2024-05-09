import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Import your custom CSS file
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [updateNotification, setUpdateNotification] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (auth && auth.user) {
          const response = await axios.get(
            `https://localhost:44385/api/notifications/${auth.user.username}`
          );
          setNotifications(response.data.reverse());
          // Count unread notifications
          const unreadNotifications = response.data.filter(
            (notification) => !notification.isRead
          );
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [auth, updateNotification]);

  const updateNotificationStatusForUser = async (username) => {
    try {
      // Make a PUT request to update the status of all notifications for the user
      await axios.put(
        `https://localhost:44385/api/notifications/Read/${username}`
      );
      console.log(
        "Notification status updated successfully for user:",
        username
      );
      setUpdateNotification(!updateNotification);
    } catch (error) {
      console.error("Error updating notification status for user:", error);
    }
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      await updateNotificationStatusForUser(auth.user.username);
      setUnreadCount(0); // Reset the unread count
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top mb-0">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Blog APP
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <div style={{ position: "relative" }}>
                <FontAwesomeIcon
                  icon={faBell}
                  style={{
                    color: "#FFD43B",
                    width: "30px",
                    height: "25px",
                    paddingTop: "10px",
                    paddingRight: "30px",
                    cursor: "pointer",
                  }}
                  onClick={handleNotificationClick}
                />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "8px",
                      backgroundColor: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "25px",
                      paddingLeft: "6px",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            {!auth.user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <div style={{ marginRight: "10px", display: "flex" }}>
                <li className="nav-item">
                  <NavLink
                    to={`/dashboard/${
                      auth?.user?.role === "Admin" ? "admin" : "user"
                    }`}
                    style={{ color: "white" }}
                    className="nav-link"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ border: "none" }}
                  >
                    {auth?.user?.username}
                  </NavLink>
                  <ul className="dropdown-menu">
                    {/* <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === "Admin" ? "admin" : "user"
                        }`}
                        className="dropdown-item"
                      >
                        Dashboard
                      </NavLink>
                    </li> */}
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="dropdown-item"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
      {showNotifications && (
        <div
          className="notification-div"
          style={{
            position: "absolute",
            float: "right",
            top: "100%",
            marginTop: "15px",
            right: "20px",
            width: "450px",
            height: "625px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "6px",
            padding: "20px",
            zIndex: 999,
            overflowY: "auto",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>Notifications</h3>
          {notifications.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {notifications.map((notification, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  <div
                    style={{
                      backgroundColor: "#f2f2f2",
                      padding: "3%",
                      borderRadius: "6px",
                    }}
                  >
                    <p style={{ fontFamily: "Verdana" }}>
                      {notification.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
