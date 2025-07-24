import React, { useState, useEffect } from "react";
import './TrainerSignUp.css';

const TrainerSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    institute: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the page loads
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    // Validate phone number (must be a string of 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    // Check if phone number is empty or null
    if (!formData.phoneNumber) {
      setError('Phone number is required.');
      setLoading(false);
      return;
    }

    // Validate gender (must be one of the allowed values)
    const allowedGenders = ['Male', 'Female', 'Other'];
    if (!allowedGenders.includes(formData.gender)) {
      setError('Please select a valid gender.');
      setLoading(false);
      return;
    }

     // Password strength regex: min 8 chars, 1 number, 1 special, 1 uppercase, 1 lowercase
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      setError('Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    // Proceed with form submission if validations pass
    try {
      const response = await fetch('https://hilms.onrender.com/api/Trainer/Trainer-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON. Check backend logs.');
      }
  
      const data = await response.json(); // Parse JSON safely
  
      if (response.ok) {
        alert('Trainer registered successfully!');
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          institute: '',
          gender: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setError(data.error || 'Error occurred during signup.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="Trainer-signin-page">
      <div className="Trainer-signup-container">
        <form onSubmit={handleSubmit} className="Trainer-signup-form">
          <h2>Trainer SignUp</h2>
          {error && <div className="Trainer-signup-error">{error}</div>}
          
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="institute">Institution:</label>
          <input
            type="text"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="Trainer-signup-submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerSignup;
