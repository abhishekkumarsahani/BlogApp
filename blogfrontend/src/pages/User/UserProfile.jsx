import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateProfile.css'; // Import CSS for styling
import { useAuth } from '../../context/auth'; 

const UpdateProfile = () => {
  const [auth] = useAuth(); // Get the auth context
  const userId = auth.user.userId; // Extract the userId from auth

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    // Add other profile properties here if needed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:44385/api/UpdateProfile/user/${userId}`);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user profile');
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
      await axios.put(`https://localhost:44385/api/UpdateProfile/update/${userId}`, profile);
      // Handle success, maybe show a success message or redirect
      alert('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      // Handle error
      setError('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:44385/api/UpdateProfile/delete/${userId}`);
      // Handle success
    } catch (error) {
      // Handle error
      setError('Failed to delete profile');
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
          <h2>User Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Username:</strong> {profile.userName}</p>
          {/* Add other profile fields here */}
          <button onClick={handleEdit} className="edit-button">Edit Profile</button>
          <button onClick={handleDelete} className="delete-button">Delete Profile</button>
        </div>
      ) : (
        <div className="edit-profile">
          <h2>Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" name="userName" value={profile.userName} onChange={handleChange} />
            </div>
            {/* Add other profile fields here */}
            <button type="submit" className="update-button">Update Profile</button>
            <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
