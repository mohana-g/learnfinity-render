import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LearnerCourses.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [sortOption, setSortOption] = useState("");

  const learnerToken = localStorage.getItem("token"); // Assuming JWT token stored

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://hilms.onrender.com/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.data || []);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrolled courses for the logged-in Learner
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch("https://hilms.onrender.com/api/learner/enrolled-courses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${learnerToken}`, // Pass token for authentication
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const data = await response.json();
        const enrolledIds = new Set(data.data.map((course) => course._id));
        setEnrolledCourses(enrolledIds);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (learnerToken) {
      fetchEnrolledCourses();
    }
  }, [learnerToken]);

  // Handle sorting logic
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortButtonClick = () => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

    setCourses(sortedCourses);
  };

  return (
    <div className="courses-page">
      <h2>Courses Page</h2>
      <div className="courses-page-sort-by">
        <span>Sort by:</span>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Select an option</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
        <button onClick={handleSortButtonClick}>Sort</button>
      </div>

      <section className="courses-page-section">
        <div className="courses-page-container-cards">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div className="courses-page-card" key={course._id}>
                <img
                  src={course.imageurl}
                  alt={course.title}
                  className="courses-page-image"
                />
                <h3>{course.title}</h3>
                <p>
                  <strong>Instructor:</strong> {course.trainer?.fullName || "Unknown"}
                </p>
                <p>
                  <strong>Enrolled Learners:</strong> {course.learners?.length || 0}
                </p>
                {enrolledCourses.has(course._id) && <p className="enrolled-label">✔ Enrolled</p>}
                <Link
                  to={`/course-details/${course._id}`}
                  className={enrolledCourses.has(course._id) ? "btn-continue" : "btn-read-more"}
                >
                  {enrolledCourses.has(course._id) ? "Continue Course" : "Read More"}
                </Link>
              </div>
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
