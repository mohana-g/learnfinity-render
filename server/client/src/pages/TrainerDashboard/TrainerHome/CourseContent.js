import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseContent.css";

function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // ✅ Fixed: Define activeTab

  // ✅ Fetch course data from the backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // ✅ Function to calculate average rating dynamically
  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return "No ratings yet";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1); // One decimal place
  };

  // ✅ Show loading message while fetching data
  if (loading) {
    return <p>Loading course details...</p>;
  }

  // ✅ Show error message if course is not found
  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div className="course-content-container">
      <div className="left-sidebar">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "instructor" ? "active" : ""}
          onClick={() => setActiveTab("instructor")}
        >
          Instructor
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className="content-container">
        <div className="tab-content-container">
          {activeTab === "overview" && (
            <div className="tab-content">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-stats">
                <p>
                  <strong>{calculateAverageRating(course.reviews)}</strong> ⭐ ({course.reviews?.length || 0} Reviews)
                </p>
                <p>
                  <strong>{course.learners?.length || 0}</strong> Enrolled Learners
                </p>
                {/*
                <p>
                  <strong>{course.hours || "Not Assigned"}</strong> Hours Total
                </p>
                */}
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="tab-content instructor">
              <h2>{course.trainer?.fullName || "Unknown Instructor"}</h2>
              <p>
                {course.trainer
                  ? `${course.trainer.fullName} is a dedicated educator committed to academic excellence.  
                      They bring years of expertise and a passion for teaching.  
                      Known for their engaging and insightful approach to education.  
                      They inspire Learners through innovative and practical learning.  
                      A respected mentor, shaping future professionals with dedication.`
                  : "No instructor bio available."
                }
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-content reviews">
              <h3>Learner Reviews</h3>
              {Array.isArray(course.reviews) && course.reviews.length > 0 ? (
                course.reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <p className="review-name">
                      <strong>{review.learnerName}</strong>
                    </p>
                    <p className="review-rating">Rating: {review.rating} ⭐</p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="course-actions">
          <div className="course-content-box">
            <h3>Course Content</h3>
            <div className="action-buttons">
              <button
                onClick={() => navigate(`/course/edit/${courseId}`)}
                className="action-btn edit"
              >
                Edit
              </button>

              <button
                onClick={() => navigate(`/course/upload/${courseId}`)}
                className="action-btn upload"
              >
                Upload
              </button>

              <button
                onClick={() => navigate(`/course/addquiz/${courseId}`)}
                className="action-btn quiz"
              >
                Add Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
