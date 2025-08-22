import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminHome.css';

// Skeleton components for loading states
const TableSkeleton = ({ rows = 5, cols = 8 }) => (
  <div className="admin-table-skeleton">
    <div className="skeleton-header">
      {Array.from({ length: cols }).map((_, i) => (
        <div className="skeleton-cell skeleton-header-cell" key={i}></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div className="skeleton-row" key={r}>
        {Array.from({ length: cols }).map((_, c) => (
          <div className="skeleton-cell" key={c}></div>
        ))}
      </div>
    ))}
  </div>
);

const CourseCardSkeleton = () => (
  <div className="course-card skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-text long"></div>
    <div className="skeleton-btn"></div>
  </div>
);

const TrainerCardSkeleton = () => (
  <div className="trainer-skeleton-card">
    <div className="trainer-skeleton-avatar"></div>
    <div className="trainer-skeleton-text short"></div>
    <div className="trainer-skeleton-text long"></div>
    <div className="trainer-skeleton-btn"></div>
    <div className="trainer-skeleton-btn"></div>
  </div>
);

const LearnerProgressSkeleton = () => (
  <div className="admin-learner-card learner-skeleton-card">
    <div className="learner-skeleton-avatar"></div>
    <div className="learner-skeleton-text short"></div>
    <div className="learner-skeleton-text long"></div>
    <div className="learner-skeleton-btn"></div>
  </div>
);

const LeaderboardSkeleton = () => (
  <div className="leaderboard-skeleton">
    <div className="leaderboard-top3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="leaderboard-item top-scorer" key={i}>
          <div className="skeleton-avatar leaderboard-skeleton-avatar"></div>
          <div className="skeleton-text leaderboard-skeleton-name"></div>
          <div className="skeleton-text leaderboard-skeleton-marks"></div>
        </div>
      ))}
    </div>
    <div className="leaderboard-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="leaderboard-grid-item" key={i}>
          <div className="skeleton-avatar leaderboard-skeleton-avatar"></div>
          <div className="skeleton-text leaderboard-skeleton-name"></div>
          <div className="skeleton-text leaderboard-skeleton-marks"></div>
        </div>
      ))}
    </div>
  </div>
);

const gradients = [
  "linear-gradient(135deg, #ff7e5f, #feb47b)", // orange → peach
  "linear-gradient(135deg, #6a11cb, #2575fc)", // purple → blue
  "linear-gradient(135deg, #00c6ff, #0072ff)", // cyan → blue
  "linear-gradient(135deg, #f7971e, #ffd200)", // orange → yellow
  "linear-gradient(135deg, #11998e, #38ef7d)", // green → light green
  "linear-gradient(135deg, #ff416c, #ff4b2b)", // pink → red
  "linear-gradient(135deg, #833ab4, #fd1d1d)", // violet → red
  "linear-gradient(135deg, #00b09b, #96c93d)", // teal → lime
];

function getGradientFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}



const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('manage-users');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  const [searchCourseQuery, setSearchCourseQuery] = useState('');

  const navigate = useNavigate();
  const [learnersProgress, setLearnersProgress] = useState([]);
  const [expandedLearner, setExpandedLearner] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [trainersLoading, setTrainersLoading] = useState(true);
  const [learnersLoading, setLearnersLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.get('https://hilms.onrender.com/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchTrainers = async () => {
    setTrainersLoading(true);
    try {
      const response = await axios.get('https://hilms.onrender.com/api/admin/pending-trainers');
      setTrainers(response.data.trainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setTrainersLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await axios.get('https://hilms.onrender.com/api/admin/courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTrainers();
    fetchCourses();
    fetchLearnersProgress();
    fetchLeaderboard();
  }, []);
  

  const fetchLearnersProgress = async () => {
    setLearnersLoading(true);
    try {
      const response = await axios.get('https://hilms.onrender.com/api/admin/learners-progress');
      setLearnersProgress(response.data);
    } catch (error) {
      console.error('Error fetching Learner progress:', error);
    } finally {
      setLearnersLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const response = await axios.get("https://hilms.onrender.com/api/learner/leaderboard");
      setLeaderboard(response.data);
    } catch (err) {
      setLeaderboardError("Failed to fetch leaderboard");
    } finally {
      setLeaderboardLoading(false);
    }
  };

  

  const handleSectionChange = (section) => setActiveSection(section);

  const navigateToAddCourse = () => navigate('/admin/add-course');

  const confirmAction = (message, action) => {
    if (window.confirm(message)) {
      action();
    }
  };

  const blockUser = async (userId) => {
    confirmAction("Are you sure you want to block this user?", async () => {
        try {
            const response = await axios.put(`https://hilms.onrender.com/api/admin/block-user/${userId}`);
             console.log("Block Response:", response.data);
            alert("User has been blocked!");
            fetchUsers(); // Refresh the user list
         } catch (error) {
            console.error("Error blocking user:", error.response ? error.response.data : error);
       }
    });
  };

  const unblockUser = async (userId) => {
      confirmAction("Are you sure you want to unblock this user?", async () => {
          try {
              const response = await axios.put(`https://hilms.onrender.com/api/admin/unblock-user/${userId}`);
              console.log("Unblock Response:", response.data);
              alert("User has been unblocked!");
              fetchUsers(); // Refresh the user list
          } catch (error) {
              console.error("Error unblocking user:", error.response ? error.response.data : error);
          }
      });
  };


  const deleteUser = async (userId) => {
      confirmAction("Are you sure you want to delete this user?", async () => {
          try {
            await axios.delete(`https://hilms.onrender.com/api/admin/delete-user/${userId}`);
            alert("User has been deleted!");
              fetchUsers();
          } catch (error) {
              console.error("Error deleting user:", error);
          }
      });
  };

  const deleteCourse = async (courseId) => {
    confirmAction('Are you sure you want to delete this course?', async () => {
      try {
        await axios.delete(`https://hilms.onrender.com/api/admin/delete-course/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    });
  };

  const approveTrainer = async (trainerId) => {
    confirmAction('Are you sure you want to approve this trainer?', async () => {
      try {
        await axios.put(`https://hilms.onrender.com/api/admin/approve-trainer/${trainerId}`);
        fetchTrainers();
      } catch (error) {
        console.error('Error approving trainer:', error);
      }
    });
  };

  const declineTrainer = async (trainerId) => {
    confirmAction('Are you sure you want to decline this trainer?', async () => {
      try {
        await axios.put(`https://hilms.onrender.com/api/admin/decline-trainer/${trainerId}`);
        fetchTrainers();
      } catch (error) {
        console.error('Error declining trainer:', error);
      }
    });
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin's Home Page</h1>
        <p>Welcome to Learnfinity Admin</p>
        <p>This is a place for Admin to control and manage the website</p>
      </header>

      <div className="admin-actions">
        <button className="action-btn" onClick={() => handleSectionChange('manage-users')}>Manage Users</button>
        <button className="action-btn" onClick={() => handleSectionChange('manage-courses')}>Manage Courses</button>
        <button className="action-btn" onClick={() => handleSectionChange('approve-trainers')}>Approve Trainers</button>
        <button className="action-btn" onClick={() => handleSectionChange('manage-learners')}>Learners Progress</button>
        <button className="action-btn" onClick={() => handleSectionChange('leaderboard')}>View Leaderboard</button>

      </div>

      <div className="admin-section">
        {/* Manage Users Section */}
        {activeSection === 'manage-users' && (
          <div className="manage-users">
            <h2>Manage Users</h2>

            {/* Search bar */}
            <div className="admin-search-container">
              <input
                type="text"
                placeholder="Search users by name or email...🔍"
                className="admin-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

    <div className="user-table-container">
      {usersLoading ? (
        <TableSkeleton rows={10} cols={8} />
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
    <table className="user-table">
      <thead>
        <tr>
              <th>No</th> {/* <-- New Column */}

          <th>Profile</th>
          <th>Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>DOB / Institution</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users
          .filter(user => user.role !== 1)
          .filter((user) => {
            const learnerName =
              user.role === 0 && user.learner
                ? `${user.learner.firstName || ''} ${user.learner.lastName || ''}`
                : '';
            const trainerName =
              user.role === 2 && user.trainer
                ? user.trainer.fullName || ''
                : '';
            const name = learnerName || trainerName;
            const email = user.email || '';
            return (
              name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              email.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
          .map((user, index) => {
            const fullName =
              user.role === 0 && user.learner
                ? `${user.learner.firstName} ${user.learner.lastName}`
                : user.role === 2 && user.trainer
                ? user.trainer.fullName
                : 'Unknown';

            const phone =
              user.role === 0 && user.learner
                ? user.learner.phone
                : user.role === 2 && user.trainer
                ? user.trainer.phoneNumber
                : 'N/A';

            const detail =
              user.role === 0 && user.learner
                ? user.learner.dob
                  ? new Date(user.learner.dob).toLocaleDateString()
                  : 'N/A'
                : user.role === 2 && user.trainer
                ? user.trainer.institute
                : 'N/A';

            return (
              <tr key={user._id}>
                          <td>{index + 1}</td> {/* <-- User number column */}

                {/* <td>
                  <img
                    src={
                      user.profileImage ||
                      'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg'
                    }
                    alt={`${fullName}'s profile`}
                          className="table-profile-image"
                  />
                </td> */}

                <td>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${fullName}'s profile`}
                      className="table-profile-image"
                    />
                  ) : (
                    <div
                      className="initial-avatar"
                      style={{
                        background: getGradientFromName(fullName), // 🎨 controlled gradient
                      }}
                    >
                      {fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </td>


                <td>{fullName}</td>
                <td>{user.role === 0 ? 'Learner' : 'Trainer'}</td>
                <td>{user.email}</td>
                <td>{phone}</td>
                <td>{detail}</td>
                <td>
                  <button
                    className={user.flag === 1 ? 'unblock-btn' : 'block-btn'}
                    onClick={() =>
                      user.flag === 1 ? unblockUser(user._id) : blockUser(user._id)
                    }
                  >
                    {user.flag === 1 ? 'Unblock' : 'Block'}
                  </button>
                  <button className="admin-delete-btn" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  )}
</div>

          </div>
        )}

        {/* Manage Courses Section */}
        {activeSection === 'manage-courses' && (
          <div className="manage-courses">
            <h2>Manage Courses</h2>

             {/* Search bar */}
    <div className="admin-search-container">
      <input
        type="text"
        placeholder="Search courses by title or description... 🔍"
        className="admin-search-input"
        value={searchCourseQuery}
        onChange={(e) => setSearchCourseQuery(e.target.value)}
      />
    </div>

            <button className="add-course-btn" onClick={navigateToAddCourse}>Add Course</button>
           <div className="course-cards">
            {coursesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            ) : courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
                courses
                .filter((course) =>
            course.title.toLowerCase().includes(searchCourseQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchCourseQuery.toLowerCase())
          )
                .map((course) => (
                  <div className="course-card" key={course._id}>
                  <img src={`https://hilms.onrender.com${course.imageurl}`} alt={course.title} className="course-image" />
                  <p className="course-title-label">Title:<span className="course-title">{course.title}</span></p>
                  <p className="course-description-label">Description:<span className="course-description">{course.description}</span></p>
                  <button className="admin-delete-btn" onClick={() => deleteCourse(course._id)}>Delete Course</button>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Approve Trainers Section */}
        {activeSection === 'approve-trainers' && (
        <div className="approve-trainers">
          <h2>Approve Trainers</h2>
          <div className="trainer-cards">
            {trainersLoading ? (
              Array.from({ length: 4 }).map((_, i) => <TrainerCardSkeleton key={i} />)
            ) : trainers.length === 0 ? (
              <p>No pending trainers for approval.</p>
            ) : (
              trainers.map((trainer) => (
                <div className="trainer-card" key={trainer._id}>
                  {/* <img 
                    src={trainer.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"} 
                    alt={`${trainer.fullName}'s profile`} 
                    className="profile-image" 
                  /> */}
                  {trainer.profileImage ? (
                    <img
                      src={trainer.profileImage}
                      alt={`${trainer.fullName}'s profile`}
                      className="profile-image"
                    />
                  ) : (
                    <div
                      className="initial-image"
                      style={{
                        background: getGradientFromName(trainer.fullName), // gradient background
                      }}
                    >
                      {trainer.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <p><strong>{trainer.fullName}</strong></p>
                  <p>Email: {trainer.email}</p>
                  <p>Phone: {trainer.phoneNumber || "N/A"}</p>
                  <button className="approve-btn" onClick={() => approveTrainer(trainer._id)}>Approve</button>
                  <button className="decline-btn" onClick={() => declineTrainer(trainer._id)}>Decline</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Learners Progress Section */}
      {activeSection === 'manage-learners' && (
      <div className="manage-learners learner-progress-section">
        <h2>Learners Progress</h2>

         {learnersLoading ? (
            <div className="admin-learner-cards">
              {Array.from({ length: 4 }).map((_, i) => (
                <LearnerProgressSkeleton key={i} />
              ))}
            </div>
          ) : learnersProgress.length === 0 ? (
            <p>No Learner data found.</p>
        ) : (
          <div className="admin-learner-cards">
            {learnersProgress.map((learner) => (
              <div className="admin-learner-card" key={learner._id}>
                <p><strong>{learner.firstName} {learner.lastName}</strong></p>
                <p>{learner.email}</p>
                <p>
                  <strong>Enrolled Courses:</strong> {learner.enrolledCourses.length}
                  <button
                    className="toggle-details-button"
                    onClick={() =>
                      setExpandedLearner(expandedLearner === learner._id ? null : learner._id)
                    }
                  >
                    {expandedLearner === learner._id ? 'Hide Details' : 'Show Details'}
                  </button>
                </p>

                {expandedLearner === learner._id && (
                  <div className="admin-course-list">
                    {learner.enrolledCourses.map((course, index) => (
                    <div key={index} className="admin-course-progress">
                      <p><strong>{course.courseTitle}</strong></p>
                      <p>Chapters: {course.totalChapters}</p>
                      <p>Total Lessons: {course.totalLessons}</p>
                      <p>Completed Lessons: {course.completedLessons}</p>
                      <p>Total Quizzes: {course.totalQuizzes}</p>
                      <p>Completed Quizzes: {course.completedQuizzes}</p>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progressPercent}%` }}
                        ></div>
                      </div>
                      <p className="progress-text">{course.progressPercent}% completed</p>
                    </div>
                  ))}

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Leaderboard Section */}
{/* Leaderboard Section */}
{activeSection === 'leaderboard' && (
  <section className="admin-leaderboard-section">
    <h2>🏆 Learner Leaderboard</h2>
    {leaderboardError && <p className="error-message">{leaderboardError}</p>}
    {leaderboardLoading ? (
      <LeaderboardSkeleton />
    ) : leaderboard.length === 0 ? (
      <p>No leaderboard data available</p>
    ) : (
      <>
        <p className="leaderboard-note">
          Top 3 Learners are highlighted with badges!
        </p>
        <div className="leaderboard-top3">
          {leaderboard.slice(0, 3).map((learner, index) => (
            <div
              className={`leaderboard-item top-scorer`}
              key={index}
              onClick={() => setSelectedLearner(learner)}
              style={{ cursor: 'pointer' }}
            >
              <div className="leaderboard-rank">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="leaderboard-profile">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${learner.name}`}
                  alt={learner.name}
                  className="profile-avatar"
                />
                <div className="leaderboard-details">
                  <h3>{learner.name}</h3>
                  <p>{learner.totalMarks} Marks</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="leaderboard-grid">
          {leaderboard.slice(3).map((learner, index) => (
            <div
              className="leaderboard-grid-item"
              key={index + 3}
              onClick={() => setSelectedLearner(learner)}
              style={{ cursor: 'pointer' }}
            >
              <div className="grid-rank">{index + 4}</div>
              <div className="grid-profile">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${learner.name}`}
                  alt={learner.name}
                  className="profile-avatar"
                />
                <div>
                  <h4>{learner.name}</h4>
                  <p>{learner.totalMarks} Marks</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
    {selectedLearner && (
      <div className="learner-popup-overlay" onClick={() => setSelectedLearner(null)}>
        <div className="learner-popup-card" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedLearner.name}</h2>
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${selectedLearner.name}`}
            alt={selectedLearner.name}
            className="profile-avatar"
          />
          <p><strong>Email:</strong> {selectedLearner.email ? selectedLearner.email : 'Email not provided'}</p>
          <p><strong>Phone:</strong> {selectedLearner.phone ? selectedLearner.phone : 'Phone number not provided'}</p>
          <p><strong>Total Marks:</strong> {selectedLearner.totalMarks}</p>
          <p><strong>Rank:</strong> {leaderboard.findIndex(s => s.name === selectedLearner.name) + 1}</p>
          <p><strong>Enrolled Courses:</strong> {selectedLearner.enrolledCourses?.length || 0}</p>
          <p><strong>Date of Joined:</strong> {new Date(selectedLearner.DateofJoined).toLocaleDateString()}</p>
          <button className="leaderboard-close-btn" onClick={() => setSelectedLearner(null)}>Close</button>
        </div>
      </div>
    )}
  </section>
)}


      </div>
    </div>
  );
};

export default AdminDashboard;
