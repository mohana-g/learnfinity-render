import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./LearnerHome.css";
// import {
//   FaInstagram,
//   FaFacebookF,
//   FaTwitter,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import User1 from '../../../assets/User1.jpg';
// import User2 from '../../../assets/User2.jpg';
// import User3 from '../../../assets/User3.avif';
// import User4 from '../../../assets/User4.avif';
// import User5 from '../../../assets/User5.avif';


// Career Path Skeleton Card
const CareerPathSkeleton = () => (
  <div className="career-path-card skeleton-card">
    <div className="skeleton skeleton-career-title"></div>
    <div className="skeleton skeleton-career-levels"></div>
    <div className="skeleton skeleton-career-btn"></div>
  </div>
);

// Career Path Cards Component
function CareerPathCards({ paths = [], onReadMore }) {
  return (
    <section className="career-path-cards-container">
      {paths.length > 0 ? (
        paths.map((path) => (
          <div key={path._id} className="career-path-card">
            <h3>{path.title}</h3>
            <p className="career-path-levels">
              <strong>Levels:</strong> {path.levelSummary || "No levels"}
            </p>
            <button
              className="btn-read-more"
              onClick={() => onReadMore(path._id)}
            >
              Read More
            </button>
          </div>
        ))
      ) : (
        <p>No career paths available</p>
      )}
    </section>
  );
}

// Skeleton loader for enrolled courses
const LearnerEnrolledCoursesSkeleton = ({ count = 3 }) => (
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

function LearnerHome() {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        const response = await axios.get("https://hilms.onrender.com/api/career-paths");
        setCareerPaths(Array.isArray(response.data) ? response.data : response.data.data || []);
      } catch (error) {
        console.error("Error fetching career paths:", error);
        setCareerPaths([]);
      } finally {
        setLoadingPaths(false);
      }
    };

    fetchCareerPaths();
  }, []);


  // const testimonials = [
  //   {
  //     name: 'Preetham',
  //     quote: "I've learned so much from this platform. The courses are top-notch, and the instructors are experts in their fields.",
  //     image: User5,
  //   },
  //   {
  //     name: 'Chaitanya',
  //     quote: 'The interactive lessons and quizzes have made my learning experience enjoyable and effective. I highly recommend it!',
  //     image: User4,
  //   },
  //   {
  //     name: 'Abhishikth',
  //     quote: "This e-learning platform has been a game-changer for me. It's convenient, flexible, and has helped me advance in my career.",
  //     image: User3,
  //   },
  //   {
  //     name: 'Narasimha',
  //     quote: "I can't believe how much I've grown as a learner. The variety of courses is impressive, and the support is outstanding.",
  //     image: User1,
  //   },
  //   {
  //     name: 'Manjith',
  //     quote: "The quality of education here is unmatched. I'm grateful for the opportunity to expand my knowledge and skills.",
  //     image: User2,
  //   },
  // ];

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

  // Fetch enrolled courses for the learner
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://hilms.onrender.com/api/learner/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEnrolledCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  
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

  const handleReadMore = (pathId) => {
    navigate(`/career-path/${pathId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="learnerHeader">
        <div className="learnerHeaderContent">
          <h1>Learner's Home Page</h1>
          <h1 className="learnerHeaderHeading">
            Welcome to Learnfinity - Empowering Your Learning Journey
          </h1>
          {/* <p className="learnerHeaderText">
            Explore a wide range of courses designed to help you achieve your
            goals. Learn from top instructors and grow your skills today!
          </p> */}
          <Link to="/learner-dashboard/courses">
            <button className="learnerHeaderButton">Explore Courses</button>
          </Link>
        </div>
      </section>

      {/* Enrolled Courses Section */}

      <section className="enrolled-courses-section">
  <h2>Your Enrolled Courses</h2>
  {loading ? (
    <LearnerEnrolledCoursesSkeleton count={4} />
  ) : enrolledCourses.length > 0 ? (
    <div className="courses-container-cards">
      {enrolledCourses.map((course) => (
        <Link
          to={`/course-interaction/${course._id}`}
          className="courses-card-link"
          key={course._id}
        >
          <div className="courses-card">
            <img src={course.imageurl} alt={course.title} className="courses-image" />
            <h3>{course.title}</h3>
            <p>
              <strong>Instructor:</strong> {course.trainer.fullName}
            </p>
            <p>
              <strong>Enrolled learners:</strong> {course.learners.length}
            </p>
            <div className="btn-primary">Go to Course</div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <p className="no-courses-text">You have not enrolled in any courses yet.</p>
  )}
</section>

      {/* <section className="enrolled-courses-section">
      <h2>Your Enrolled Courses</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : enrolledCourses.length > 0 ? (
        <div className="courses-container-cards">
          {enrolledCourses.map((course) => (
            <div className="courses-card" key={course._id}>
              <img src={course.imageurl} alt={course.title} className="courses-image" />
              <h3>{course.title}</h3>
              <p>
                <strong>Instructor:</strong> {course.trainer.fullName}
              </p>
              <p>
                <strong>Enrolled learners:</strong> {course.learners.length}
              </p>
              <Link to={`/course-interaction/${course._id}`} className="btn-primary">
                Go to Course
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-courses-text">You have not enrolled in any courses yet.</p>
      )}
    </section>
     */}
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
            Top 3 learners are highlighted with badges!
          </p>
        )} */}

        <div className="leaderboard-top3">
          {leaderboard.slice(0, 3).map((learner, index) => (
            <div
              className="leaderboard-item top-scorer"
              key={index}
              onClick={() => setSelectedLearner(learner)}
            >
              <div className="leaderboard-rank">{getBadge(index) || `${index + 1}`}</div>
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
      </section>
       {/* learner Details Popup */}
       {selectedLearner && (
        <div className="learner-popup-overlay" onClick={() => setSelectedLearner(null)}>
          <div className="learner-popup-card" onClick={(e) => e.stopPropagation()}>
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

      {/* Career Path Suggestions Section */}
      <section className="career-path-section">
        <h2>Career Path Suggestions</h2>
        <p>
          Select your desired career to see recommended courses tailored for your
          goal, from beginner to advanced levels.
        </p>
        {loadingPaths ? (
          <div className="career-path-cards-container">
            {Array.from({ length: 3 }).map((_, i) => (
              <CareerPathSkeleton key={i} />
            ))}
          </div>
        ) : (
          <CareerPathCards paths={careerPaths} onReadMore={handleReadMore} />
        )}
      </section>



      {/* Testimonials Section */}
      {/* <section className="stu-testimonials-container">
        <h2>Learner Testimonials</h2>
        <div className="stu-testimonial-slider">
          <button className="nav-button left" onClick={handlePrevClick}>
            <FaArrowLeft />
          </button>
          <div className="stu-testimonial">
            <div className="stu-image-container">
              <img className='stu-testimonial-image' src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
            </div>
            <p className="stu-quote">{testimonials[currentIndex].quote}</p>
            <p className="stu-name">{testimonials[currentIndex].name}</p>
          </div>
          <button className="stu-nav-button right" onClick={handleNextClick}>
            <FaArrowRight />
          </button>
        </div>
      </section> */}

      {/* Expert Instructors Section */}
      {/* <section className="expert-instructors-section">
        <h2>Expert Instructors</h2>
        <div className="instructors-container">
          <div className="instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-character-developer-working-laptop-web-app-development-frontend-deployment_1298309-24267.jpg?w=360"
              alt="Kevin"
              className="instructor-image"
            />
            <h3>Kevin</h3>
            <p className="instructor-title">Web Development</p>
            <p>
              As a seasoned Web Developer, I bring a wealth of experience in
              harnessing the power of data to drive informed decision-making and
              optimize online strategies. With a track record of 9 years in the
              field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>

          <div className="instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-using-laptops-sitting-chairs-cute-cartoon-working-playing-social-media-technology-futuristic-poster-ai-generative_43969-5403.jpg"
              alt="Max"
              className="instructor-image"
            />
            <h3>Max</h3>
            <p className="instructor-title">Data Analyst</p>
            <p>
              As a seasoned Data Analyst, I bring a wealth of experience in
              harnessing the power of data to drive informed decision-making and
              optimize online strategies. With a track record of 6 years in the
              field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>

          <div className="instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/young-woman-using-laptop-3d-character-illustration_839035-210525.jpg?w=360"
              alt="Linda"
              className="instructor-image"
            />
            <h3>Linda</h3>
            <p className="instructor-title">Full Stack Developer</p>
            <p>
              As a seasoned Full Stack Developer, I bring a wealth of experience
              in harnessing the power of data to drive informed decision-making
              and optimize online strategies. With a track record of 5 years in
              the field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default LearnerHome;
