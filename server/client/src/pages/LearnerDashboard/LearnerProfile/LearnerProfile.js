import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearnerProfile.css"; 

// Skeleton component for loading state
const LearnerProfileSkeleton = () => (
  <div className="learner-profile-container">
    <div className="learner-profile-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-field" />
      <div className="skeleton skeleton-btn" />
      <div className="skeleton skeleton-btn" />
    </div>
    <div className="learner-course-progress">
      <div className="skeleton skeleton-section-title" />
      <div className="course-progress-grid">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="course-progress-card" key={i}>
            <div className="skeleton skeleton-course-title" />
            <div className="skeleton skeleton-progress-bar" />
            <div className="skeleton skeleton-percent" />
            <div className="skeleton skeleton-details" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LearnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [courseProgress, setCourseProgress] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Learner data from backend
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem("token"); // Retrieve token from localStorage
  //       if (!token) {
  //         setError("Unauthorized: No token found");
  //         setLoading(false);
  //         return;
  //       }

  //       const response = await axios.get("http://localhost:5000/api/Learner/profile", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setProfile(response.data);
  //     } catch (err) {
  //       setError("Failed to fetch profile");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

    useEffect(() => {
    const fetchProfileAndProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          setLoading(false);
          return;
        }

        const [profileRes, progressRes] = await Promise.all([
          axios.get("https://hilms.onrender.com/api/learner/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://hilms.onrender.com/api/learner/progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data);
        setCourseProgress(progressRes.data.enrolledCourses);
      } catch (err) {
        setError("Failed to fetch profile or course progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProgress();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      await axios.put("https://hilms.onrender.com/api/learner/profile/update", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleEditAccount = () => {
    navigate("/learner-dashboard/profile/editaccount");
  };

  if (loading) return <LearnerProfileSkeleton />;
  // if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="learner-profile-container">
      <h1>Learner Profile</h1>
      <div className="learner-profile-card">
        {!isEditing ? (
          <>
            <p><strong>First Name:</strong> {profile?.firstName}</p>
            <p><strong>Last Name:</strong> {profile?.lastName}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone Number:</strong> {profile?.phone}</p>
            <p><strong>Date of Birth:</strong> {new Date(profile?.dob).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {profile?.address}</p>
            <button onClick={handleEditToggle}>Edit Profile</button>
            <button onClick={handleEditAccount}>Edit Account</button>
          </>
        ) : (
          <>
            <div>
              <label>First Name: </label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} />
            </div>
            <div>
              <label>Last Name: </label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} />
            </div>
            <div>
              <label>Email: </label>
              <input type="email" name="email" value={profile.email} onChange={handleInputChange} disabled />
            </div>
            <div>
              <label>Phone Number: </label>
              <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label>Date of Birth: </label>
              <input type="date" name="dob" value={profile.dob.split("T")[0]} onChange={handleInputChange} />
            </div>
            <div>
              <label>Address: </label>
              <input type="text" name="address" value={profile.address} onChange={handleInputChange} />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </>
        )}
      </div>
      {/* Course Progress Section */}
      {courseProgress.length > 0 && (
      <div className="learner-course-progress">
        <h2>📚 My Course Progress</h2>
        <div className="course-progress-grid">
          {courseProgress.map((course, index) => {
            const isOpen = expandedCourse === index;
            return (
              <div key={index} className="course-progress-card">
                <div className="card-header">
                  <h4>{course.courseTitle}</h4>
                  <button
                    className="toggle-details"
                    onClick={() => setExpandedCourse(isOpen ? null : index)}
                  >
                    {isOpen ? "Hide Details" : "Show Details"}
                  </button>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${course.progressPercent}%` }}
                  ></div>
                </div>
                <p className="progress-percent">{course.progressPercent}%</p>

                {isOpen && (
                  <div className="card-details">
                    <p>Chapters: {course.totalChapters}</p>
                    <p>Total Lessons: {course.totalLessons}</p>
                    <p>Completed Lessons: {course.completedLessons}</p>
                    <p>Total Quizzes: {course.totalQuizzes}</p>
                    <p>Completed Quizzes: {course.completedQuizzes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}
    </div>
  );
};

export default LearnerProfile;
