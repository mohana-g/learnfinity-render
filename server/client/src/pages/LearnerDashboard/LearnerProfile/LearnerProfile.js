// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./LearnerProfile.css";

// // Skeleton component for loading state
// const LearnerProfileSkeleton = () => (
//   <div className="learner-profile-container">
//     <div className="learner-profile-card">
//       <div className="skeleton skeleton-title" />
//       <div className="skeleton skeleton-field" />
//       <div className="skeleton skeleton-field" />
//       <div className="skeleton skeleton-field" />
//       <div className="skeleton skeleton-field" />
//       <div className="skeleton skeleton-field" />
//       <div className="skeleton skeleton-btn" />
//       <div className="skeleton skeleton-btn" />
//     </div>
//     <div className="learner-course-progress">
//       <div className="skeleton skeleton-section-title" />
//       <div className="course-progress-grid">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div className="course-progress-card" key={i}>
//             <div className="skeleton skeleton-course-title" />
//             <div className="skeleton skeleton-progress-bar" />
//             <div className="skeleton skeleton-percent" />
//             <div className="skeleton skeleton-details" />
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const LearnerProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [editData, setEditData] = useState(null); // 👈 temp state for editing
//   const [isEditing, setIsEditing] = useState(false);
//   const [courseProgress, setCourseProgress] = useState([]);
//   const [expandedCourse, setExpandedCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  
//   // 🏆 Added Rank State
//   const [userRank, setUserRank] = useState(null);
//   const [userBadge, setUserBadge] = useState(null);

//   const navigate = useNavigate();

//   // Fetch learner data + progress
//   useEffect(() => {
//     const fetchProfileAndProgress = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Unauthorized: No token found");
//           setLoading(false);
//           return;
//         }

//         // ✅ Step 1: Always fetch profile first
//         const profileRes = await axios.get(
//           "https://hilms.onrender.com/api/learner/profile",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setProfile(profileRes.data);

//         // ✅ Step 2: Then try to fetch course progress (optional)
//         try {
//           const progressRes = await axios.get(
//             "https://hilms.onrender.com/api/learner/progress",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );

//           // Check if learner has enrolled courses
//           if (
//             progressRes.data &&
//             Array.isArray(progressRes.data.enrolledCourses) &&
//             progressRes.data.enrolledCourses.length > 0
//           ) {
//             setCourseProgress(progressRes.data.enrolledCourses);
//           } else {
//             setCourseProgress([]); // no courses yet
//           }
//         } catch (progressError) {
//           console.warn("No enrolled courses found yet");
//           setCourseProgress([]); // if no course progress API fails, don't break profile
//         }

//         // Fetch Leaderboard to Get Rank + Badge
//       try {
//         const leaderboardRes = await axios.get(
//           "https://hilms.onrender.com/api/learner/leaderboard"
//         );
//         const leaderboard = leaderboardRes.data;

//         // Find the user’s rank by comparing email
//         const rank =
//           leaderboard.findIndex(
//             (u) => u.email === profileRes.data.email
//           ) + 1;

//         if (rank > 0) {
//           setUserRank(rank);

//           // 🎖 Assign Badge Based on Rank
//           if (rank === 1) setUserBadge("👑 🥇 Gold Champion");
//           else if (rank === 2) setUserBadge("👑 🥈 Silver Star");
//           else if (rank === 3) setUserBadge("👑 🥉 Bronze Achiever");
//           else setUserBadge(`⭐ Rank ${rank}`);
//         } else {
//           setUserRank(null);
//           setUserBadge("Unranked");
//         }
//       } catch (leaderboardError) {
//         console.warn("Leaderboard fetch failed");
//         setUserRank(null);
//         setUserBadge("Unranked");
//       }

//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileAndProgress();
//   }, []);


//   // 🔁 Handle edit toggle
//   const handleEditToggle = () => {
//     if (!isEditing) {
//       // Entering edit mode: clone current profile
//       setEditData({ ...profile });
//     }
//     setIsEditing(!isEditing);
//   };

//   // 📝 Handle field changes in edit mode
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 💾 Save changes
//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Unauthorized: No token found");
//         return;
//       }

//       await axios.put("https://hilms.onrender.com/api/learner/profile/update", editData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       alert("Profile updated successfully!");
//       setProfile(editData); // ✅ reflect updated data in UI
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to update profile");
//     }
//   };

//   const handleEditAccount = () => {
//     navigate("/learner-dashboard/profile/editaccount");
//   };

//   if (loading) return <LearnerProfileSkeleton />;
//   if (error) return <p className="error-message">{error}</p>;

//   return (
//     <div className="learner-profile-container">
//       <h1>Learner Profile</h1>
//       <div className="learner-profile-card">
//         {/* 🏆 Rank Badge Display */}
//         {userBadge && (
//           <div
//             className={`rank-badge ${
//               userRank === 1
//                 ? "rank-1"
//                 : userRank === 2
//                 ? "rank-2"
//                 : userRank === 3
//                 ? "rank-3"
//                 : "rank-normal"
//             }`}
//           >
//             {userBadge}
//           </div>
//         )}
//         {!isEditing ? (
//           <>
//             <p><strong>First Name:</strong> {profile?.first_name}</p>
//             <p><strong>Last Name:</strong> {profile?.last_name}</p>
//             <p><strong>Email:</strong> {profile?.email}</p>
//             <p><strong>Phone Number:</strong> {profile?.phone}</p>
//             <p><strong>Date of Birth:</strong> {new Date(profile?.dob).toLocaleDateString()}</p>
//             <p><strong>Address:</strong> {profile?.address}</p>
//             <button onClick={handleEditToggle}>Edit Profile</button>
//             <button onClick={handleEditAccount}>Edit Account</button>
//           </>
//         ) : (
//           <>
//             <div>
//               <label>First Name: </label>
//               <input
//                 type="text"
//                 name="first_name"
//                 value={editData.first_name}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label>Last Name: </label>
//               <input
//                 type="text"
//                 name="last_name"
//                 value={editData.last_name}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label>Email: </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={editData.email}
//                 disabled
//               />
//             </div>
//             <div>
//               <label>Phone Number: </label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={editData.phone}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label>Date of Birth: </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={editData.dob?.split("T")[0]}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label>Address: </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={editData.address}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <button onClick={handleSave}>Save</button>
//             <button onClick={handleEditToggle}>Cancel</button>
//           </>
//         )}
//       </div>

//       {/* 📘 Course Progress Section */}
//       {courseProgress && courseProgress.length > 0 ? (
//         <div className="learner-course-progress">
//           <h2>📚 My Course Progress</h2>
//           <div className="course-progress-grid">
//             {courseProgress.map((course, index) => {
//               const isOpen = expandedCourse === index;
//               return (
//                 <div key={index} className="course-progress-card">
//                   <div className="card-header">
//                     <h4>{course.courseTitle}</h4>
//                     <button
//                       className="toggle-details"
//                       onClick={() =>
//                         setExpandedCourse(isOpen ? null : index)
//                       }
//                     >
//                       {isOpen ? "Hide Details" : "Show Details"}
//                     </button>
//                   </div>

//                   <div className="progress-bar">
//                     <div
//                       className="progress-fill"
//                       style={{ width: `${course.progressPercent}%` }}
//                     ></div>
//                   </div>
//                   <p className="progress-percent">{course.progressPercent}%</p>

//                   {isOpen && (
//                     <div className="card-details">
//                       <p>Chapters: {course.totalChapters}</p>
//                       <p>Total Lessons: {course.totalLessons}</p>
//                       <p>Completed Lessons: {course.completedLessons}</p>
//                       <p>Total Quizzes: {course.totalQuizzes}</p>
//                       <p>Completed Quizzes: {course.completedQuizzes}</p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//           <p className="no-courses-message">
//             You haven’t enrolled in any courses yet.
//           </p>
//       )}
//     </div>
//   );
// };

// export default LearnerProfile;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LearnerProfile.css";

const LearnerProfileSkeleton = () => (
  <div className="learner-profile-container skeleton-mode">
    <div className="left-col">
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
    <div className="right-col">
      <div className="achievements-card skeleton-placeholder" />
      <div className="badge-card skeleton-placeholder" />
      <div className="targets-card skeleton-placeholder" />
    </div>
  </div>
);

const LearnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [courseProgress, setCourseProgress] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userRank, setUserRank] = useState(null);
  const [userBadge, setUserBadge] = useState(null);

  const [achievements, setAchievements] = useState([]);
  const [targets, setTargets] = useState({
    description: "Complete two more courses this month",
    percent: 50,
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingRef = useRef(null);

  const navigate = useNavigate();

  // THEME: read saved theme
  useEffect(() => {
    const saved = localStorage.getItem("learn_theme");
    if (saved === "dark") document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, []);

  // FETCH profile, progress and leaderboard (badge)
  useEffect(() => {
    const fetchAll = async () => {
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

        // progress
        try {
          const progressRes = await axios.get(
            "https://hilms.onrender.com/api/learner/progress",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const enrolled = Array.isArray(progressRes.data.enrolledCourses)
            ? progressRes.data.enrolledCourses
            : [];
          setCourseProgress(enrolled);

          // derive achievements from courses (simple heuristics)
          const derived = [];
          const completedCourses = enrolled.filter((c) => c.progressPercent >= 100).length;
          if (completedCourses >= 1) derived.push(`Completed ${completedCourses} course(s)`);
          const finishedLessons = enrolled.reduce((acc, c) => acc + (c.completedLessons || 0), 0);
          if (finishedLessons >= 5) derived.push(`Completed ${finishedLessons} lessons`);
          const highQuizScores = enrolled.reduce((acc, c) => acc + ((c.topQuizScores || []).filter(s => s >= 90).length || 0), 0);
          if (highQuizScores >= 1) derived.push(`Scored 90%+ in ${highQuizScores} quiz(es)`);
          if (derived.length === 0) derived.push("Getting started — keep learning!");
          setAchievements(derived);
        } catch (err) {
          setCourseProgress([]);
          setAchievements(["No activity yet — start a course!"]);
        }

        // leaderboard -> rank/badge
        try {
          const lb = await axios.get("https://hilms.onrender.com/api/learner/leaderboard");
          const list = lb.data || [];
          const rankIndex = list.findIndex((u) => u.email === profileRes.data.email);
          const rank = rankIndex >= 0 ? rankIndex + 1 : null;
          if (rank) {
            setUserRank(rank);
            if (rank === 1) setUserBadge("👑 Gold Champion");
            else if (rank === 2) setUserBadge("🥈 Silver Star");
            else if (rank === 3) setUserBadge("🥉 Bronze Achiever");
            else setUserBadge(`⭐ Rank ${rank}`);
          } else {
            setUserRank(null);
            setUserBadge("Unranked");
          }
        } catch (err) {
          setUserRank(null);
          setUserBadge("Unranked");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Simple polling for new notifications / new courses (every 60s)
  useEffect(() => {
    const startPolling = () => {
      pollingRef.current = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          // Example: check notifications endpoint. If you don't have it, check progress endpoint and compare lengths
          const res = await axios.get("https://hilms.onrender.com/api/learner/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = res.data?.notifications || [];
          // If new ones arrived (by id), update state and unread count
          if (list.length && list.length !== notifications.length) {
            const newOnes = list.slice(0, 5); // keep top few
            setNotifications(newOnes);
            setUnreadCount((prev) => {
              // compute new unread as difference
              const diff = Math.max(0, list.length - prev);
              return Math.min(list.length, prev + diff || list.length);
            });
          }
        } catch (err) {
          // If notifications endpoint doesn't exist, try a fallback: check progress API for recently added courses
          try {
            const token = localStorage.getItem("token");
            const p = await axios.get("https://hilms.onrender.com/api/learner/progress", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const enrolled = Array.isArray(p.data.enrolledCourses) ? p.data.enrolledCourses : [];
            if (enrolled.length > courseProgress.length) {
              const newCount = enrolled.length - courseProgress.length;
              setNotifications((prev) => [
                { id: `new-course-${Date.now()}`, message: `🎉 ${newCount} new course(s) added.` },
                ...prev,
              ]);
              setUnreadCount((c) => c + 1);
              setCourseProgress(enrolled);
            }
          } catch (err) {
            // ignore
          }
        }
      }, 60000); // 60s
    };

    startPolling();
    return () => clearInterval(pollingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseProgress, notifications]);

  // Toggle theme
  const handleToggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    const nowDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("learn_theme", nowDark ? "dark" : "light");
  };

  // Editing handlers
  const handleEditToggle = () => {
    if (!isEditing) setEditData({ ...profile });
    setIsEditing(!isEditing);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://hilms.onrender.com/api/learner/profile/update", editData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setProfile(editData);
      setIsEditing(false);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };
  const handleEditAccount = () => navigate("/learner-dashboard/profile/editaccount");

  // notification UI helpers
  const markAllRead = () => {
    setUnreadCount(0);
  };
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // derived UI values for badge visual
  const badgeClass = userRank === 1 ? "rank-1" : userRank === 2 ? "rank-2" : userRank === 3 ? "rank-3" : "rank-normal";

  if (loading) return <LearnerProfileSkeleton />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="learner-profile-container">
      <header className="topbar">
        <div className="logo-left">HIROTEC INDIA</div>
        <div className="top-actions">
          <div className="notification-toggle" title="Notifications">
            <button className="notif-btn" onClick={markAllRead}>
              🔔 {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
            </button>
          </div>
          <div className="theme-toggle">
            <label className="switch">
              <input type="checkbox" onChange={handleToggleTheme} defaultChecked={document.body.classList.contains("dark-mode")} />
              <span className="slider" />
            </label>
            <span className="theme-label">Dark Mode</span>
          </div>
        </div>
      </header>

      <div className="content-grid">
        <div className="left-col">
          <h2>Learner Details</h2>
          <div className="learner-profile-card">
            <div className={`rank-badge ${badgeClass}`}>{userBadge}</div>

            {!isEditing ? (
              <>
                <p><strong>First Name:</strong> {profile?.first_name || "—"}</p>
                <p><strong>Last Name:</strong> {profile?.last_name || "—"}</p>
                <p><strong>Email:</strong> {profile?.email || "—"}</p>
                <p><strong>Phone Number:</strong> {profile?.phone || "—"}</p>
                <p><strong>Date of Birth:</strong> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "—"}</p>
                <p><strong>Address:</strong> {profile?.address || "—"}</p>

                <div className="profile-buttons">
                  <button className="btn primary" onClick={handleEditToggle}>Edit Profile</button>
                  <button className="btn danger" onClick={handleEditAccount}>Edit Account</button>
                </div>
              </>
            ) : (
              <>
                <div className="form-row"><label>First Name</label><input name="first_name" value={editData.first_name} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Last Name</label><input name="last_name" value={editData.last_name} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Phone</label><input name="phone" value={editData.phone} onChange={handleInputChange} /></div>
                <div className="form-row"><label>DOB</label><input type="date" name="dob" value={editData.dob?.split?.("T")?.[0] || ""} onChange={handleInputChange} /></div>
                <div className="form-row"><label>Address</label><input name="address" value={editData.address} onChange={handleInputChange} /></div>
                <div className="profile-buttons">
                  <button className="btn primary" onClick={handleSave}>Save</button>
                  <button className="btn" onClick={handleEditToggle}>Cancel</button>
                </div>
              </>
            )}
          </div>

          <h3>📚 My Course Progress</h3>
          <div className="course-progress-grid">
            {courseProgress.length > 0 ? (
              courseProgress.map((course, idx) => {
                const isOpen = expandedCourse === idx;
                return (
                  <div className="course-progress-card" key={idx}>
                    <div className="card-header">
                      <h4>{course.courseTitle || course.title || "Untitled Course"}</h4>
                      <button className="toggle-details" onClick={() => setExpandedCourse(isOpen ? null : idx)}>
                        {isOpen ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progressPercent || 0}%` }} />
                    </div>
                    <p className="progress-percent">{course.progressPercent || 0}%</p>
                    {isOpen && (
                      <div className="card-details">
                        <p>Chapters: {course.totalChapters || 0}</p>
                        <p>Total Lessons: {course.totalLessons || 0}</p>
                        <p>Completed Lessons: {course.completedLessons || 0}</p>
                        <p>Total Quizzes: {course.totalQuizzes || 0}</p>
                        <p>Completed Quizzes: {course.completedQuizzes || 0}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-courses-message">You haven’t enrolled in any courses yet.</div>
            )}
          </div>
        </div>

        <div className="right-col">
          <h2 className="center">Learner Profile</h2>

          <div className="achievements-card">
            <h3>🏆 Achievements</h3>
            <ul>
              {achievements.map((a, i) => (
                <li key={i}><span className="dot" /> {a} <span className="star">⭐</span></li>
              ))}
            </ul>
          </div>

          <div className="badge-card">
            <h3>⭐ Badge</h3>
            <div className="badge-visual">
              <div className="badge-title">{userBadge}</div>
              <div className="badge-illustration"> {/* you can replace with image */}
                <div className="podium"><div className="p2">2</div><div className="p1">1</div><div className="p3">3</div></div>
              </div>
            </div>
          </div>

          <div className="targets-card">
            <h3>🎯 My Learning Targets</h3>
            <p className="targets-desc">{targets.description}</p>
            <div className="targets-bar">
              <div className="targets-fill" style={{ width: `${targets.percent}%` }}></div>
              <div className="targets-percent">{targets.percent}%</div>
            </div>
          </div>

          <div className="notifications-panel">
            <div className="notifications-header">
              <h4>Notifications</h4>
              <button className="clear" onClick={() => { setNotifications([]); setUnreadCount(0); }}>Clear</button>
            </div>
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifs">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div className="notif-item" key={n.id || n._id}>
                    <div className="notif-text">{n.message || n.title || "New activity"}</div>
                    <div className="notif-actions">
                      <button className="small" onClick={() => dismissNotification(n.id || n._id)}>Dismiss</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="profile-footer"> {/* small footer */}</footer>
    </div>
  );
};

export default LearnerProfile;
