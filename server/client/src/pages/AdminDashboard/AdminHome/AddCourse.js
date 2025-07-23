import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddCourse.css";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [trainer, setTrainer] = useState("");
  const [image, setImage] = useState(null);
  const [trainers, setTrainers] = useState([]); // Dynamic Trainers list
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Fetch Trainers dynamically
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("https://hilms.onrender.com/api/admin/trainers");
        setTrainers(response.data.trainers);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File size should be less than 5MB");
      return;
    }
  
    setImage(file);
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseTitle || !courseName || !description || !trainer || !image) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", courseTitle);
    formData.append("name", courseName);
    formData.append("description", description);
    formData.append("trainerId", trainer);
    formData.append("image", image);

    try {
      const response = await axios.post("https://hilms.onrender.com/api/admin/add-course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setErrorMessage("");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 2500);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMessage("Failed to add course. Try again.");
    }
  };

  return (
    <div className="add-course-container">
      <h2>Add New Course</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseTitle">Course Title:</label>
          <input type="text" id="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="courseName">Course Name:</label>
          <input type="text" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="trainer">Select Trainer:</label>
          <select id="trainer" value={trainer} onChange={(e) => setTrainer(e.target.value)} required>
            <option value="">Select a Trainer</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Course Image:</label>
          <input type="file" id="image" onChange={handleImageChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="a-btn-submit">Add Course</button>
          <button type="button" className="a-btn-back" onClick={() => navigate("/admin-dashboard")}>Back</button>
        </div>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isSubmitted && <p className="success-message">Course added successfully! Redirecting...</p>}

    </div>
  );
};

export default AddCourse;
