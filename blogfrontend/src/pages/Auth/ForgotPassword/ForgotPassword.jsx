import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Import your custom CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({});

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:44385/api/authorization/changepassword', {
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      setStatus(response.data);
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {status.Message && <div className="message">{status.Message}</div>}
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Current Password:</label>
          <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
