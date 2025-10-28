import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

//skeleton code
const CourseDetailsSkeleton = () => (
  <div className="course-details-page">
    <div className="course-header">
      <div className="course-info-card">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-rating" />
        <ul className="course-meta">
          <li className="skeleton skeleton-meta" />
          <li className="skeleton skeleton-meta" />
          <li className="skeleton skeleton-meta" />
          <li className="skeleton skeleton-meta" />
        </ul>
      </div>
      <div className="course-sidebar-card">
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-feature" />
        <div className="skeleton skeleton-feature" />
        <div className="skeleton skeleton-feature" />
        <div className="skeleton skeleton-feature" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
    <div className="course-content">
      <div className="tab-list">
        <div className="skeleton skeleton-tab" />
        <div className="skeleton skeleton-tab" />
        <div className="skeleton skeleton-tab" />
      </div>
      <div className="tab-content">
        <div className="skeleton skeleton-section-title" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
      </div>
    </div>
  </div>
);


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("curriculum");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // const isAuthenticated = localStorage.getItem("isAuthenticated");
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token); // true if token exists

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const hasScrolled = useRef(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hilms.onrender.com/api/courses/course-details/${courseId}`);
        setCourse(response?.data?.data || {});
      } catch (err) {
        console.error("Error fetching course details:", err.message);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }

    if (!hasScrolled.current) {
      window.scrollTo(0, 0);
      hasScrolled.current = true;
    }
  }, [courseId]);

  const handleEnroll = async () => {
  if (!isAuthenticated) {
    alert("Please sign in to enroll in this course.");
    navigate("/SignIn");
    return;
  }

  try {
    await axios.post(
      `https://hilms.onrender.com/api/courses/course-details/${courseId}/enroll`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCourse((prevCourse) => ({
      ...prevCourse,
      learners: [...(prevCourse.learners || []), userId],
    }));

    alert("You have successfully enrolled in this course!");
  } catch (err) {
    console.error("Enrollment error:", err.response?.data?.message || err.message);
    alert(err.response?.data?.message || "Failed to enroll. Please try again.");
  }
};


  // const handleEnroll = async () => {
  //   if (isAuthenticated === "true") {
  //     try {
  //       const token = localStorage.getItem("token");
  
  //       await axios.post(
  //         `https://hilms.onrender.com/api/courses/course-details/${courseId}/enroll`,
  //         {},
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  
  //       // Update the Learner count dynamically
  //       setCourse((prevCourse) => ({
  //         ...prevCourse,
  //         Learners: [...(prevCourse.Learners || []), userId],
  //       }));
  
  //       alert("You have successfully enrolled in this course!");
  //     } catch (err) {
  //       console.error("Enrollment error:", err.response?.data?.message || err.message);
  //       alert(err.response?.data?.message || "Failed to enroll. Please try again.");
  //     }
  //   } else {
  //     alert("Please sign in to enroll in this course.");
  //     navigate("/SignIn");
  //   }
  // };
    

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <CourseDetailsSkeleton />;
  // if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    course && (
      <div className="course-details-page">
        <div className="course-header">
          <div className="course-info-card">
            <h1>Course Title: <span className="course-details-title">{course.title || "Untitled Course"}</span></h1>
            <div className="ratings">
              ★ {course.averageRating || 0}/5 ({course.reviewCount || 0} Reviews)
            </div>
            <ul className="course-meta">
              <li>Enrolled Learners: {Array.isArray(course.learners) ? course.learners.length : 0}</li>
              <li>Course Trainer: {course.trainer?.fullName || "Unknown"}</li>
              <li>Last Updated: {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : "N/A"}</li>
              <li>Language: {course.language || "English"}</li>
            </ul>
          </div>

          <div className="course-sidebar-card">
            <img src={course.imageurl || "https://via.placeholder.com/400"} alt={course.title} className="course-image" />
            <div className="course-features">
              <h3>Course Features:</h3>
              <ul>
                <li>🎥 {Array.isArray(course.chapters) ? course.chapters.length : 0} Chapters</li>
                <li>📖 {course.lessonCount || 0} Lessons</li>
                <li>📚 {Array.isArray(course.quizzes) ? course.quizzes.length : 0} Quizzes</li>
                {/* <li>💳 Free Course</li> */}
                <li>🏆 Certificate of Completion</li>
              </ul>
            </div>
            {role === "learner" && (
              <button className="enroll-btn" onClick={handleEnroll}>Enroll Now</button>
            )}
          </div>
        </div>

        <div className="course-content">
          <div className="tab-list">
            {["curriculum", "instructor", "reviews"].map((tab) => (
              <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => handleTabChange(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "curriculum" && (
              <div className="curriculum">
                <h2>Course Content</h2>
                {Array.isArray(course.chapters) && course.chapters.length > 0 ? (
                  <ul className="chapter-list">
                    {course.chapters.map((chapter) => (
                      <li key={chapter.id}>
                        <strong>Chapter: {chapter.name || "Untitled Chapter"}</strong>
                        <ul className="lesson-list">
                          {Array.isArray(chapter.lessons) && chapter.lessons.length > 0 ? (
                            chapter.lessons.map((lesson) => (
                              <li key={lesson.id}>
                                <strong>Lesson {lesson.number}: {lesson.title || "Untitled Lesson"}</strong>
                                <p>{lesson.description || "No description available"}</p>
                              </li>
                            ))
                          ) : (
                            <li>No lessons available</li>
                          )}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No chapters added yet!</p>
                )}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="instructor">
                <h2>Instructor Information</h2>
                <p><strong>Full Name: </strong>{course.trainer?.fullName || "N/A"}</p>
                <p><strong>Email: </strong> {course.trainer?.email || "N/A"}</p>
                <p><strong>Institution: </strong> {course.trainer?.institute || "N/A"}</p>
                {/* <p><strong>Phone: </strong> {course.trainer?.phoneNumber || "N/A"}</p> */}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews">
                <h2>Learner Reviews</h2>
                {Array.isArray(course.reviews) && course.reviews.length > 0 ? (
                  <ul className="review-list">
                    {course.reviews.map((review) => (
                      <li key={review.id}>
                        <strong>{review.learner_name || "Anonymous"}:</strong>
                        <p>Rating: ★ {review.rating}/5</p>
                        <p>{review.comment || "No comment provided."}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviews yet. Be the first to review this course!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default CourseDetails;
