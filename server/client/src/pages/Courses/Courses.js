import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://hilms.onrender.com/api/courses"); // Backend API URL
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.data || []); // Ensure only the array is stored
      } catch (error) {
        console.error(error.message);
      }
    };    

    fetchCourses();
  }, []);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortButtonClick = () => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (sortOption === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    setCourses(sortedCourses);
  };

  return (
    <div className="courses-page">
      <h2>Courses Page</h2>

      {/* Sorting options */}
      <div className="courses-page-sort-by">
        <span>Sort by:</span>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Select an option</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
        <button onClick={handleSortButtonClick}>Sort</button>
      </div>

     {/* Display courses if available, or show 'No courses available' message */}
<section className="courses-page-section">
  <div className="courses-page-container-cards">
    {courses.length > 0 ? (
      courses.map((course) => (
        <Link
          to={`/course-details/${course._id}`}
          key={course._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="courses-page-card">
            <img
              src={course.imageurl}
              alt={course.title}
              className="courses-page-image"
            />
            <h3>{course.title}</h3>
            <p>
              <strong>Instructor:</strong>{" "}
              {course.trainer?.fullName || "Unknown"}
            </p>
            <p>
              <strong>Enrolled Learners:</strong>{" "}
              {course.learners?.length || 0}
            </p>
            <span className="btn-primary">Read More</span>
          </div>
        </Link>
      ))
    ) : (
      <p>No courses available</p>
    )}
      </div>
</section>
    </div>
  );
};

export default CoursesPage;
