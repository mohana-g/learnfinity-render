/*import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the reset token from the URL query parameters
  const resetToken = new URLSearchParams(window.location.search).get('token');

  // Validate token presence
  if (!resetToken) {
    setError('Invalid or expired reset token');
    return null; // Optionally render an error message if token is missing
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setMessage('');
    } else {
      setLoading(true);
      try {
        // Make API call to reset the password
        const response = await axios.post('http://localhost:5000/api/auth/reset-password', { password, token: resetToken });

        if (response.data.message) {
          setMessage(response.data.message); // Success message
        }
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError('An error occurred while resetting the password. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
*/

import React, { useState } from 'react';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the reset token from the URL query parameters
  const resetToken = new URLSearchParams(window.location.search).get('token');

  // Validate token presence
  if (!resetToken) {
    setError('Invalid or expired reset token');
    return <p className="error-message">Invalid or expired reset token</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage('');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('https://hilms.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token: resetToken }), // Send encoded email as token
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Password reset successful.');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Error resetting password.');
      }
    } catch (err) {
      setError('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
