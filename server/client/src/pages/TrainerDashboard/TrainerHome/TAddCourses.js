import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for API requests
import './TAddCourses.css';

const TAddCourses = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get stored token

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store uploaded image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!title || !name || !description || !image) {
      setErrorMessage('All fields are required!');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      await axios.post('https://hilms.onrender.com/api/trainer/add-course', formData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send JWT token for authentication
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Course added successfully!');
      setTimeout(() => navigate('/trainer-dashboard'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigate('/trainer-dashboard');

  return (
    <div className="add-course-container">
      <h2>Add New Course</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Course Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Course Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Course Image:</label>
          <input type="file" id="image" onChange={handleImageChange} required />
        </div>
        <button type="submit" className="t-btn-submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Course'}
        </button>
      </form>

      <button className="t-btn-back" onClick={handleBack}>Go Back</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

    </div>
  );
};

export default TAddCourses;
