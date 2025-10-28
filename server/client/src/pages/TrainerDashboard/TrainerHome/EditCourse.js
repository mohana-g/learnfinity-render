import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditCourse.css";

const EditCourse = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const navigate = useNavigate(); // Used to navigate after save
  const [courseTitle, setCourseTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch course data using courseId
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const courseData = response.data.data;

        setCourseTitle(courseData.title);
        setCourseName(courseData.name);
        setDescription(courseData.description);
      } catch (error) {
        setErrorMessage("Error fetching course details.");
        console.error(error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the uploaded image
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!courseTitle || !courseName || !description) {
      setErrorMessage("Please fill in all the fields before submitting the form.");
      setIsSubmitted(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", courseTitle);
      formData.append("name", courseName);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`http://localhost:5000/api/courses/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSubmitted(true);
      setErrorMessage("");

      setTimeout(() => {
        navigate(`/Trainer-dashboard/course-content/${courseId}`);
      }, 2000);
    } catch (error) {
      setErrorMessage("Error updating course.");
      console.error(error);
    }
  };

  const handleGoBack = () => {
    navigate(`/Trainer-dashboard/course-content/${courseId}`);
  };

  return (
    <div className="edit-course-container">
      <h2>Edit Course</h2>
      <form className="edit-course-form" onSubmit={handleSubmit}>
        <div className="edit-form-group">
          <label htmlFor="courseTitle">Course Title:</label>
          <input
            type="text"
            id="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="image">Course Image:</label>
          <input type="file" id="image" onChange={handleImageChange} />
        </div>
        <button type="submit" className="edit-btn-submit">Save Changes</button>
      </form>

      {errorMessage && <p className="edit-error-message">{errorMessage}</p>}
      <button onClick={handleGoBack} className="edit-btn-back">Go Back</button>
      {isSubmitted && <p className="edit-success-message">Course updated successfully! Redirecting...</p>}
    </div>
  );
};

export default EditCourse;
