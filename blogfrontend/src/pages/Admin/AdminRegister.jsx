import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth/Register/Register.css"; // Import your custom CSS file
import AdminSideBar from "./AdminSideBar";

const AdminRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:44385/api/authorization/registrationAdmin",
        { username, password, email, name }
      );
      if (response.data.statusCode === 1) {
        // Registration successful, redirect to login
        navigate("/dashboard/admin");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
        <div>
            <AdminSideBar />
        </div>
    <div className="registration-container" >
        
      <h2>Registration</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Full Name"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Create username"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <button type="submit" className="btn btn-dark">
          Register
        </button>
      </form>
    </div>
    </div>
  );
};

export default AdminRegistration;
