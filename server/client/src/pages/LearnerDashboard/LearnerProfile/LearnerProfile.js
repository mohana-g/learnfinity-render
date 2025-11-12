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
    <div className="learner-achievements">
      <div className="skeleton skeleton-section-title" />
      <div className="achievement-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="achievement-card skeleton-achievement-card">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-text" />
          </div>
        ))}
      </div>
    </div>
    <div className="learner-course-progress">
      <div className="skeleton skeleton-section-title" />
      <div className="course-progress-grid">
        {Array.from({ length: 3 }).map((_, i) => (
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
  const [editData, setEditData] = useState(null); // 👈 temp state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [courseProgress, setCourseProgress] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // 🏆 Added Rank State
  const [userRank, setUserRank] = useState(null);
  const [userBadge, setUserBadge] = useState(null);

  // 🧩 Add near the top, after your other useStates:
  const [achievements, setAchievements] = useState([]);

  const navigate = useNavigate();

  // // Fetch learner data + progress
  // useEffect(() => {
  //   const fetchProfileAndProgress = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         setError("Unauthorized: No token found");
  //         setLoading(false);
  //         return;
  //       }

  //       // ✅ Step 1: Always fetch profile first
  //       const profileRes = await axios.get(
  //         "https://hilms.onrender.com/api/learner/profile",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setProfile(profileRes.data);

  //       // ✅ Step 2: Then try to fetch course progress (optional)
  //       try {
  //         const progressRes = await axios.get(
  //           "https://hilms.onrender.com/api/learner/progress",
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );

  //         // Check if learner has enrolled courses
  //         if (
  //           progressRes.data &&
  //           Array.isArray(progressRes.data.enrolledCourses) &&
  //           progressRes.data.enrolledCourses.length > 0
  //         ) {
  //           setCourseProgress(progressRes.data.enrolledCourses);
  //         } else {
  //           setCourseProgress([]); // no courses yet
  //         }
  //       } catch (progressError) {
  //         console.warn("No enrolled courses found yet");
  //         setCourseProgress([]); // if no course progress API fails, don't break profile
  //       }

  //       // Fetch Leaderboard to Get Rank + Badge
  //     try {
  //       const leaderboardRes = await axios.get(
  //         "https://hilms.onrender.com/api/learner/leaderboard"
  //       );
  //       const leaderboard = leaderboardRes.data;

  //       // Find the user’s rank by comparing email
  //       const rank =
  //         leaderboard.findIndex(
  //           (u) => u.email === profileRes.data.email
  //         ) + 1;

  //       if (rank > 0) {
  //         setUserRank(rank);

  //         // 🎖 Assign Badge Based on Rank
  //         if (rank === 1) setUserBadge("👑 🥇 Gold Champion");
  //         else if (rank === 2) setUserBadge("👑 🥈 Silver Star");
  //         else if (rank === 3) setUserBadge("👑 🥉 Bronze Achiever");
  //         else setUserBadge(`⭐ Rank ${rank}`);
  //       } else {
  //         setUserRank(null);
  //         setUserBadge("Unranked");
  //       }
  //     } catch (leaderboardError) {
  //       console.warn("Leaderboard fetch failed");
  //       setUserRank(null);
  //       setUserBadge("Unranked");
  //     }

  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to fetch profile");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfileAndProgress();
  // }, []);

  // 🧠 Inside your useEffect (after setting courseProgress)
useEffect(() => {
  const fetchProfileAndProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const profileRes = await axios.get(
        "https://hilms.onrender.com/api/learner/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(profileRes.data);

      let enrolled = [];
      try {
        const progressRes = await axios.get(
          "https://hilms.onrender.com/api/learner/progress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        enrolled = progressRes.data?.enrolledCourses || [];
        setCourseProgress(enrolled);
      } catch {
        console.warn("No enrolled courses found yet");
        setCourseProgress([]);
      }

      // 🏆 Leaderboard Fetch
      try {
        const leaderboardRes = await axios.get(
          "https://hilms.onrender.com/api/learner/leaderboard"
        );
        const leaderboard = leaderboardRes.data;
        const rank =
          leaderboard.findIndex((u) => u.email === profileRes.data.email) + 1;
        if (rank > 0) {
          setUserRank(rank);
          if (rank === 1) setUserBadge("👑 🥇 Gold Champion");
          else if (rank === 2) setUserBadge("👑 🥈 Silver Star");
          else if (rank === 3) setUserBadge("👑 🥉 Bronze Achiever");
          else setUserBadge(`⭐ Rank ${rank}`);
        } else {
          setUserRank(null);
          setUserBadge("Unranked");
        }
      } catch {
        console.warn("Leaderboard fetch failed");
        setUserRank(null);
        setUserBadge("Unranked");
      }

      // 🧮 Achievement Calculation
      if (Array.isArray(enrolled) && enrolled.length > 0) {
        const derived = [];

        const completedCourses = enrolled.filter(
          (c) => c.progressPercent >= 100
        ).length;

        const finishedLessons = enrolled.reduce(
          (acc, c) => acc + (c.completedLessons || 0),
          0
        );

        // 🕒 Average course progress
        const avgProgress =
        enrolled.length > 0
          ? enrolled.reduce((acc, c) => acc + ((c.progressPercent || 0) / 100), 0) /
            enrolled.length * 100
          : 0;

        // 🎯 Courses in progress (not completed but started)
        const inProgressCourses = enrolled.filter(
          (c) => c.progressPercent > 0 && c.progressPercent < 100
        ).length;

        // 🔥 Streak: learner has completed multiple lessons in multiple courses
        const activeLearner =
          finishedLessons >= 3 ? "🔥 Active Learner — keep it up!" : null;

        // 🌟 Consistency: user has enrolled in multiple courses
        const consistentLearner =
          enrolled.length >= 3
            ? "🌟 Consistent Learner — enrolled in multiple courses"
            : null;

        // Push achievements
        if (completedCourses >= 1)
          derived.push(`🏁 Completed ${completedCourses} course(s)`);
        if (inProgressCourses >= 1)
          derived.push(`🚀 Currently learning ${inProgressCourses} course(s)`);
        if (finishedLessons >= 5)
          derived.push(`📘 Completed ${finishedLessons} lesson(s)`);

        if (avgProgress >= 50)
        derived.push(
          `📈 Maintained an average progress of ${avgProgress.toFixed(1)}%`
        );

        if (activeLearner) derived.push(activeLearner);
        if (consistentLearner) derived.push(consistentLearner);

        if (derived.length === 0)
          derived.push("✨ Getting started — keep learning!");

        setAchievements(derived);
      } else {
        setAchievements(["✨ Getting started — keep learning!"]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  fetchProfileAndProgress();
}, []);

  // 🔁 Handle edit toggle
  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode: clone current profile
      setEditData({ ...profile });
    }
    setIsEditing(!isEditing);
  };

  // 📝 Handle field changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 💾 Save changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      await axios.put("https://hilms.onrender.com/api/learner/profile/update", editData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      setProfile(editData); // ✅ reflect updated data in UI
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  const handleEditAccount = () => {
    navigate("/learner-dashboard/profile/editaccount");
  };

  if (loading) return <LearnerProfileSkeleton />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="learner-profile-container">
      <h1>Learner Profile</h1>

      {/* 🌟 Flex container for Profile + Rank */}
      <div className="learner-stage-container">
        {/* Left Side – Profile Card */}
        <div className="learner-profile-card">
          {!isEditing ? (
            <>
              <p><strong>First Name:</strong> {profile?.first_name}</p>
              <p><strong>Last Name:</strong> {profile?.last_name}</p>
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
                <input
                  type="text"
                  name="first_name"
                  value={editData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Last Name: </label>
                <input
                  type="text"
                  name="last_name"
                  value={editData.last_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  disabled
                />
              </div>
              <div>
                <label>Phone Number: </label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Date of Birth: </label>
                <input
                  type="date"
                  name="dob"
                  value={editData.dob?.split("T")[0]}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Address: </label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleEditToggle}>Cancel</button>
            </>
          )}
        </div>

        {/* Right Side – Rank Holder Box */}
        <div className="rank-holder-card">
          <h3 className="rank-title">🏆 Stage Rank Holder</h3>
          {userBadge && (
            <div
              className={`rank-badge ${
                userRank === 1
                  ? "rank-1"
                  : userRank === 2
                  ? "rank-2"
                  : userRank === 3
                  ? "rank-3"
                  : "rank-normal"
              }`}
            >
              {userBadge}
            </div>
          )}
          {userRank && <p className="rank-text">Current Rank: #{userRank}</p>}
        </div>
      </div>
      {/* 🏆 Achievements Section */}
      {achievements.length > 0 && (
        <div className="learner-achievements">
          <h2>🏆 Achievements</h2>
          <div className="achievement-grid">
            {achievements.map((a, i) => (
              <div key={i} className="achievement-card">
                {/* <span className="achievement-icon">⭐</span> */}
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📘 Course Progress Section */}
      {courseProgress && courseProgress.length > 0 ? (
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
                      onClick={() =>
                        setExpandedCourse(isOpen ? null : index)
                      }
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
      ) : (
          <p className="no-courses-message">
            You haven’t enrolled in any courses yet.
          </p>
      )}
    </div>
  );
};

export default LearnerProfile;
