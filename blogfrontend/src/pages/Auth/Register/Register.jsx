import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Import your custom CSS file

const Registration = () => {
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
        "https://localhost:44385/api/authorization/registration",
        { username, password, email, name }
      );
      if (response.data.statusCode === 1) {
        // Registration successful, redirect to login
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#d9d0b8",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="registration-container">
        <h2 style={{ color: "white", fontFamily: "Verdana" }}>Registration</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: "white", fontFamily: "Verdana" }}>
              Name
            </label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Full Name"
            />
          </div>
          <div className="form-group">
            <label style={{ color: "white", fontFamily: "Verdana" }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="form-group">
            <label style={{ color: "white", fontFamily: "Verdana" }}>
              Username
            </label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create username"
            />
          </div>
          <div className="form-group">
            <label style={{ color: "white", fontFamily: "Verdana" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <button type="submit" className="btn btn-outline-light">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
