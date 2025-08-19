import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TrainerHome.css";
// import {
//   FaInstagram,
//   FaFacebookF,
//   FaTwitter,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import User1 from "../../../assets/User1.jpg";
// import User2 from "../../../assets/User2.jpg";
// import User3 from "../../../assets/User3.avif";
// import User4 from "../../../assets/User4.avif";
// import User5 from "../../../assets/User5.avif";


// Skeleton loader for enrolled courses
const TrainerEnrolledCoursesSkeleton = ({ count = 3 }) => (
  <div className="courses-container-cards">
    {Array.from({ length: count }).map((_, i) => (
      <div className="courses-card-link" key={i}>
        <div className="courses-card">
          <div className="skeleton skeleton-course-img" />
          <div className="skeleton skeleton-course-title" />
          <div className="skeleton skeleton-course-meta" />
          <div className="skeleton skeleton-course-meta" />
          <div className="skeleton skeleton-course-btn" />
        </div>
      </div>
    ))}
  </div>
);

const LeaderboardSkeleton = ({ count = 6 }) => {
  return (
    <div className="leaderboard-skeleton-wrapper">
      <div className="leaderboard-top3">
        {[...Array(3)].map((_, index) => (
          <div className="leaderboard-item top-scorer" key={index}>
            <div className="skeleton skeleton-avatar-circle" />
            <div className="skeleton skeleton-line-short" />
            <div className="skeleton skeleton-line-thin" />
          </div>
        ))}
      </div>

      <div className="leaderboard-grid">
        {[...Array(count - 3)].map((_, index) => (
          <div className="leaderboard-grid-item" key={index}>
            <div className="skeleton skeleton-avatar-square" />
            <div className="skeleton skeleton-line-short" />
            <div className="skeleton skeleton-line-thin" />
          </div>
        ))}
      </div>
    </div>
  );
};


function TrainerHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [selectedLearner, setSelectedLearner] = useState(null);

  // const testimonials = [
  //   {
  //     name: "Preetham",
  //     quote: "The platform provides a seamless teaching experience with excellent support and tools for instructors.",
  //     image: User5,
  //   },
  //   {
  //     name: "Chaitanya",
  //     quote: "Teaching here has been a rewarding experience. The community and resources make it easy to focus on delivering quality content.",
  //     image: User4,
  //   },
  //   {
  //     name: "Abhishikth",
  //     quote: "As an instructor, I love the flexibility and control I have over my courses. Highly recommended!",
  //     image: User3,
  //   },
  //   {
  //     name: "Narasimha",
  //     quote: "The ability to reach a global audience has made teaching on this platform an amazing opportunity.",
  //     image: User1,
  //   },
  //   {
  //     name: "Manjith",
  //     quote: "The instructor tools are intuitive and powerful, making course creation a breeze.",
  //     image: User2,
  //   },
  // ];

// ✅ Fetch assigned courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://hilms.onrender.com/api/trainer/trainer-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeachingCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // const handlePrevClick = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNextClick = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  
    useEffect(() => {
      const fetchLeaderboard = async () => {
        try {
          const response = await axios.get("https://hilms.onrender.com/api/learner/leaderboard");
          setLeaderboard(response.data);
        } catch (err) {
          setLeaderboardError("Failed to fetch leaderboard");
        }
      };
    
      fetchLeaderboard();
    }, []);
    
    const getBadge = (rank) => {
      if (rank === 0) return '🥇';
      if (rank === 1) return '🥈';
      if (rank === 2) return '🥉';
      return '';
    };
  

  return (
    <div className="trainer-container">
      {/* Hero Section */}
      <section className="trainer-header">
        <div className="trainer-header-content">
          <h1>Trainer's Home Page</h1>
          <h1 className="trainer-header-heading">
            Unlock Your Teaching Potential with Learnfinity
          </h1>
          {/* <p className="trainer-header-text">
            Create, manage, and share your knowledge with a global audience.
            Start teaching today and make an impact!
          </p> */}
          <Link to="/add-course">
            <button className="trainer-header-button">Add Course</button>
          </Link>
        </div>
      </section>

      {/* Trainer Courses Section */}
<section className="trainer-teaching-courses-section">
  <h2>Your Teaching Courses</h2>
  {loading ? (
    <TrainerEnrolledCoursesSkeleton count={3} />
  ) : teachingCourses.length > 0 ? (
    <div className="trainer-courses-container-cards">
      {teachingCourses.map((course) => (
        <Link
          to={`/trainer-dashboard/course-content/${course._id}`}
          key={course._id}
          className="trainer-courses-card-link"
        >
          <div className="trainer-courses-card">
            <img
              src={course.imageurl || "https://via.placeholder.com/150"}
              alt={course.title}
              className="trainer-courses-image"
            />
            <h3>{course.title}</h3>
            <p><strong>Instructor:</strong> {course.trainer?.fullName || "Not Available"}</p>
            <p><strong>Enrolled Learners:</strong> {course.learners?.length || 0}</p>
            <div className="btn-primary">Open Course</div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p className="trainer-no-courses-text">No assigned courses found.</p>
  )}
</section>


    {/* Leaderboard Section */}
    <section className="leaderboard-section">
        <h2>🏆 Learner Leaderboard</h2>
        {leaderboardError && <p className="error-message">{leaderboardError}</p>}
        {/* {leaderboard.length === 0 && <p>No leaderboard data available</p>} */}
        {loading ? (
          <LeaderboardSkeleton count={11} />
        ) : leaderboard.length === 0 ? (
          <p>No leaderboard data available</p>
        ) : (
          <>
            <p className="leaderboard-note">
              Top 3 learners are highlighted with badges!
            </p>
            {/* ...rest of your leaderboard rendering code... */}
          </>
        )}
        
        {/* {leaderboard.length > 0 && (
          <p className="leaderboard-note">
            Top 3 Learners are highlighted with badges!
          </p>
        )} */}

        <div className="leaderboard-top3">
          {leaderboard.slice(0, 3).map((Learner, index) => (
            <div
              className="leaderboard-item top-scorer"
              key={index}
              onClick={() => setSelectedLearner(Learner)}
            >
              <div className="leaderboard-rank">{getBadge(index) || `${index + 1}`}</div>
              <div className="leaderboard-profile">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${Learner.name}`}
                  alt={Learner.name}
                  className="profile-avatar"
                />
                <div className="leaderboard-details">
                  <h3>{Learner.name}</h3>
                  <p>{Learner.totalMarks} Marks</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-grid">
          {leaderboard.slice(3).map((Learner, index) => (
            <div
              className="leaderboard-grid-item"
              key={index + 3}
              onClick={() => setSelectedLearner(Learner)}
            >
              <div className="grid-rank">{index + 4}</div>
              <div className="grid-profile">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${Learner.name}`}
                  alt={Learner.name}
                  className="profile-avatar"
                />
                <div>
                  <h4>{Learner.name}</h4>
                  <p>{Learner.totalMarks} Marks</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
       {/* Learner Details Popup */}
       {selectedLearner && (
        <div className="Learner-popup-overlay" onClick={() => setSelectedLearner(null)}>
          <div className="Learner-popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedLearner.name}</h2>
            <img
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${selectedLearner.name}`}
              alt={selectedLearner.name}
              className="profile-avatar"
            />
            <p><strong>Email:</strong> {selectedLearner.email || 'Email not provided'}</p>
            <p><strong>Phone:</strong> {selectedLearner.phone || 'Phone number not provided'}</p>
            <p><strong>Total Marks:</strong> {selectedLearner.totalMarks}</p>
            <p><strong>Rank:</strong> {leaderboard.findIndex(s => s.name === selectedLearner.name) + 1}</p>
            <p><strong>Enrolled Courses:</strong> {selectedLearner.enrolledCourses?.length || 0}</p>
            <p><strong>Date of Joined:</strong> {new Date(selectedLearner.DateofJoined).toLocaleDateString()}</p>
            <button className="leaderboard-close-btn" onClick={() => setSelectedLearner(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      {/* <section className="trainer-testimonials-container">
        <h2>Learner Testimonials</h2>
        <div className="trainer-testimonial-slider">
          <button className="trainer-nav-button left" onClick={handlePrevClick}>
            <FaArrowLeft />
          </button>
          <div className="trainer-testimonial">
            <div className="trainer-image-container">
              <img
                className="trainer-testimonial-image"
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
              />
            </div>
            <p className="trainer-quote">{testimonials[currentIndex].quote}</p>
            <p className="trainer-name">{testimonials[currentIndex].name}</p>
          </div>
          <button className="trainer-nav-button right" onClick={handleNextClick}>
            <FaArrowRight />
          </button>
        </div>
      </section> */}

      {/* Expert Instructors Section */}
      {/* <section className="trainer-expert-instructors-section">
        <h2>Expert Instructors</h2>
        <div className="trainer-instructors-container">
          <div className="trainer-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-character-developer-working-laptop-web-app-development-frontend-deployment_1298309-24267.jpg?w=360"
              alt="Kevin"
              className="trainer-instructor-image"
            />
            <h3>Kevin</h3>
            <p className="trainer-instructor-title">Web Development</p>
            <p>
            As a seasoned Web Developer, I bring a wealth of experience in
            harnessing the power of data to drive informed decision-making and
            optimize online strategies. With a track record of 9 years in the
            field, I have honed my skills in collecting, processing, and
            analyzing web data to extract valuable insights that propel
            businesses forward.
            </p>
            <div className="social-icons">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>

          <div className="trainer-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-using-laptops-sitting-chairs-cute-cartoon-working-playing-social-media-technology-futuristic-poster-ai-generative_43969-5403.jpg"
              alt="Max"
              className="trainer-instructor-image"
            />
            <h3>Max</h3>
            <p className="trainer-instructor-title">Data Analyst</p>
            <p>
            As a seasoned Data Analyst, I bring a wealth of experience in
            harnessing the power of data to drive informed decision-making and
            optimize online strategies. With a track record of 6 years in th
            field, I have honed my skills in collecting, processing, and
            analyzing web data to extract valuable insights that propel
            businesses forward.
            </p>
            <div className="social-icons">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>

          <div className="trainer-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/young-woman-using-laptop-3d-character-illustration_839035-210525.jpg?w=360"
              alt="Linda"
              className="trainer-instructor-image"
            />
            <h3>Linda</h3>
            <p className="trainer-instructor-title">Full Stack Developer</p>
            <p>
            As a seasoned Full Stack Developer, I bring a wealth of experience
            in harnessing the power of data to drive informed decision-making
            and optimize online strategies. With a track record of 5 years i
            the field, I have honed my skills in collecting, processing, and
            analyzing web data to extract valuable insights that propel
            businesses forward.
            </p>
            <div className="social-icons">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default TrainerHome;
