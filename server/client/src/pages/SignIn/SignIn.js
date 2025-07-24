import React, { useState } from 'react';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError('Please fill all fields');
      return;
    }

    try {
      let loginUrl = '';

      // Select the correct login URL based on the role
      if (role === 'admin') {
        loginUrl = 'https://hilms.onrender.com/api/auth/admin-login';
      } else if (role === 'trainer') {
        loginUrl = 'https://hilms.onrender.com/api/auth/trainer-login';
      } else if (role === 'learner') {
        loginUrl = 'https://hilms.onrender.com/api/auth/learner-login';
      }

      // Send the email and password to the backend
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      // Check if the user is blocked (status 403)
      if (response.status === 403) {
        setError(data.error);  // Display "Your account has been blocked by the admin."
        return;
      }

      // Handle other error responses
      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          throw new Error('Login failed. Please check your credentials.');
        }
      //const data = await response.json();

      if (data.success) {
        setError('');

        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        localStorage.setItem(`${role}Token`, data.token); // <-- Add this line

        // Redirect to the appropriate dashboard based on the role
        if (role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else if (role === 'trainer') {
          window.location.href = '/trainer-dashboard';
        } else if (role === 'learner') {
          window.location.href = '/learner-dashboard';
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      // Log and show the error in case of network failure or other issues
      console.error(err);
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h2>Login Form</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="signin-form">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="learner">Learner</option>
          </select>

          <button type="submit" className="signin-btn">Login</button>
        </form>

        <div className="additional-links">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          <p><a href="/forgot-password">Forgot Password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
