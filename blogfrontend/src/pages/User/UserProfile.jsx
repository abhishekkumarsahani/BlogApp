import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateProfile.css"; // Import CSS for styling
import { useAuth } from "../../context/auth";
import { useNavigate, Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdOutlinePassword } from "react-icons/md";

import toast from "react-hot-toast";

const UpdateProfile = () => {
  const [auth, setAuth] = useAuth(); // Get the auth context
  const userId = auth.user.userId; // Extract the userId from auth
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    // Add other profile properties here if needed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
 

  // const handleLogout = () => {
  //   setAuth({
  //     ...auth,
  //     user: null,
  //     token: "",
  //   });
  //   localStorage.removeItem("auth");
  //   toast.success("Logout Successfully");
  // };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `https://localhost:44385/api/UpdateProfile/user/${userId}`
        );
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Cancel edit mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://localhost:44385/api/UpdateProfile/update/${userId}`,
        profile
      );
      // Handle success, maybe show a success message or redirect
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      // Handle error
      setError("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://localhost:44385/api/UpdateProfile/delete/${userId}`
      );
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
      localStorage.removeItem("auth");
      toast.success("Logout Successfully");
      navigate("/login")
      // Handle success
    } catch (error) {
      // Handle error
      setError("Failed to delete profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      {!isEditing ? (
        <div className="profile">
          <p className="text-center" style={{ fontFamily: "Verdana", fontSize: "25px" }}>User Profile</p>
          <table style={{borderCollapse: "separate", borderSpacing: "20px", fontFamily: "Verdana", fontSize: "15px"}}>
            <tr>
              <td>
                <strong>Name:</strong>
              </td>
              <td>{profile.name}</td>
            </tr>
            <tr>
              <td>
                <strong>Email:</strong>
              </td>
              <td>{profile.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Username:</strong>
              </td>
              <td>{profile.userName}</td>
            </tr>
          </table>

          {/* Add other profile fields here */}
          <div className="mt-2"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Link to="/forgot-password"  className="btn btn-dark" style={{display: "flex", flexDirection: "row", gap: "10px"}}>
              <MdOutlinePassword style={{width: "20px", height: "20px", marginTop: "2px"}}/> Change Password
            </Link>
            <button onClick={handleEdit} className="btn btn-dark" style={{display: "flex", flexDirection: "row", gap: "10px"}}>
              <CiEdit style={{width: "20px", height: "20px", marginTop: "2px"}}/> Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger" style={{display: "flex", flexDirection: "row", gap: "10px"}}>
              <MdDelete style={{width: "20px", height: "20px", marginTop: "2px"}}/>Delete{" "}
            </button>
          </div>
        </div>
      ) : (
        <div className="edit-profile">
          <h2>Update Profile</h2>
          <form className="form-control" onSubmit={handleSubmit}>
            <div >
              <label>Name:</label>
              <input
              className="form-group"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div >
              <label>Email:</label>
              <input
              className="form-group"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            <div >
              <label>Username:</label>
              <input
              className="form-group"
                type="text"
                name="userName"
                value={profile.userName}
                onChange={handleChange}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button type="submit" className="btn btn-success">
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
