import React, { useState } from 'react';
import axios from 'axios';
import './Popup.css'; // Import CSS for styling

const Popup = ({ onClose }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make POST request to add comment
      const response = await axios.post('https://localhost:44385/api/comments/add', {
        comment: comment,
        authorName: 'Your Name', // You can replace this with actual author name
        post_id: 1 // Replace with the actual post ID
      });
      console.log('Comment added:', response.data);
      onClose();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Enter your comment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding...' : 'Submit'}
            </button>
            <button className="close-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
