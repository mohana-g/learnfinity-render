import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    address:'',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // // Check if passwords match
    // if (formData.password !== formData.confirmPassword) {
    //   formErrors.password = "Passwords do not match";
    //   isValid = false;
    // }

    // Password strength regex: min 8 chars, 1 number, 1 special, 1 uppercase, 1 lowercase
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      formErrors.password = "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.password = "Passwords do not match";
      isValid = false;
    }

    // Check phone number format (must be 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.phone)) {
      formErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/Learner/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Learner registered successfully!');

           // Clear the form after successful registration
        setFormData({
          firstName: '',
          lastName: '',
          dob: '',
          email: '',
          phone: '',
          password: '',
          address:'',
          confirmPassword: '',
        });
        
          // Optionally redirect to login page or dashboard
        } else {
          alert(data.error || 'Error registering Learner');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Error submitting the form');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Learner SignUp</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="input-group">
            <input type="submit" value="Submit" />
          </div>
        </form>
        <p className="signin-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
