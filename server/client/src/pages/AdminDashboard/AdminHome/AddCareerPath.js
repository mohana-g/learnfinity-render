// src/pages/AdminDashboard/AddCareerPath/AddCareerPath.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCareerPath.css";

const AddCareerPath = () => {
  const [title, setTitle] = useState("");
  const [roles, setRoles] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]); // all available courses from DB
  const [selectedCourses, setSelectedCourses] = useState([]); // chosen with details

  // Fetch courses from backend
  useEffect(() => {
    axios
      .get("https://hilms.onrender.com/api/courses") // adjust if your route differs
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Add a course entry with extra info
  const handleAddCourse = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    setSelectedCourses([
      ...selectedCourses,
      {
        courseId: course._id,
        title: course.title,
        level: "",
        duration: "",
        skills: "",
      },
    ]);
  };

  // Update selected course details
  const handleCourseChange = (index, field, value) => {
    const updated = [...selectedCourses];
    updated[index][field] = value;
    setSelectedCourses(updated);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCareerPath = {
      title,
      roles: roles.split(",").map((r) => r.trim()), // store as array
      description,
      courses: selectedCourses,
    };

    try {
      await axios.post("https://hilms.onrender.com/api/careerpaths", newCareerPath);
      alert("Career Path created successfully!");
      setTitle("");
      setRoles("");
      setDescription("");
      setSelectedCourses([]);
    } catch (err) {
      console.error("Error saving career path:", err);
    }
  };

  return (
    <div className="add-careerpath-page">
      <h2>Add Career Path</h2>
      <form onSubmit={handleSubmit} className="careerpath-form">

        {/* Title */}
        <label>Title (e.g. Developer, Designer)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Roles */}
        <label>Roles (comma separated)</label>
        <input
          type="text"
          placeholder="Software Engineer, Analyst, UI/UX Designer"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        {/* Course Selection */}
        <label>Add Courses</label>
        <select onChange={(e) => handleAddCourse(e.target.value)} defaultValue="">
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        {/* Show Selected Courses with extra fields */}
        {selectedCourses.map((sc, index) => (
          <div key={index} className="selected-course">
            <h4>{sc.title}</h4>
            <label>Level</label>
            <input
              type="text"
              placeholder="Beginner / Intermediate / Advanced"
              value={sc.level}
              onChange={(e) =>
                handleCourseChange(index, "level", e.target.value)
              }
              required
            />
            <label>Duration</label>
            <input
              type="text"
              placeholder="e.g. 4 weeks"
              value={sc.duration}
              onChange={(e) =>
                handleCourseChange(index, "duration", e.target.value)
              }
              required
            />
            <label>Skills Learnt</label>
            <input
              type="text"
              placeholder="HTML basics, Tags, Forms"
              value={sc.skills}
              onChange={(e) =>
                handleCourseChange(index, "skills", e.target.value)
              }
              required
            />
          </div>
        ))}

        {/* Submit */}
        <button type="submit" className="submit-btn">
          Submit Career Path
        </button>
      </form>
    </div>
  );
};

export default AddCareerPath;
