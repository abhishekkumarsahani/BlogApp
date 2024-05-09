import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import your custom CSS file
import { useAuth } from '../../../context/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:44385/api/authorization/login', { username, password });
      if (response.data && response.data.token) {
        // Store token in local storage
        localStorage.setItem('auth', JSON.stringify(response.data));
        // Update authentication context
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        // Navigate to homepage
        navigate("/");
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again later.');
    }
  }    

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your username' />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********'/>
        </div>
        <div style={{display :"flex", flexDirection: "column", gap: "10px"}}>
        <button type="submit" className="btn btn-dark">Login</button>
        <button type="button" onClick={() => navigate("/forgot-password")} className="btn btn-link">Forgot Password</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
