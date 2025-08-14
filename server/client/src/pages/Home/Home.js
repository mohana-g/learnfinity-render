import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import User1 from '../../assets/User1.jpg';
// import User2 from '../../assets/User2.jpg';
// import User3 from '../../assets/User3.avif';
// import User4 from '../../assets/User4.avif';
// import User5 from '../../assets/User5.avif';
import './Home.css';

// Add this above your Home component
const HomeCourseSkeleton = () => (
  <div className="courses-card skeleton-card">
    <div className="skeleton skeleton-course-img"></div>
    <div className="courses-card-content">
      <div className="skeleton skeleton-course-title"></div>
      <div className="skeleton skeleton-course-meta"></div>
      <div className="skeleton skeleton-course-meta"></div>
    </div>
    <div className="skeleton skeleton-course-btn"></div>
  </div>
);

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
  //   setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  // };

  // const handleNextClick = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  // };

  // Fetch popular courses sorted by number of enrolled Learners
  const fetchPopularCourses = async () => {
    try {
      const response = await fetch('https://hilms.onrender.com/api/courses/popular');
      if (!response.ok) {
        throw new Error('Failed to fetch popular courses');
      }
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularCourses();
  }, []);


  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Unlock Your Potential</h1>
          {/* <p>Learn, Grow, and Excel with Our Online Courses</p>
          <p>Get Educated Online From Your Home. Register now and Enroll in the courses to break records.</p> */}
          <Link to="/signup" className="btn-primary">Join Now</Link>
        </div>
      </section>
      {/* Popular Courses */}
      <section className="courses-section">
        <h2>Popular Courses</h2>
        {loading ? (
          <div className="courses-container-cards">
            {Array.from({ length: 4 }).map((_, i) => (
              <HomeCourseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="courses-container-cards">
            {courses.length > 0 ? (
              courses.slice(0, 4).map((course) => (
                <Link
                  to={`/course-details/${course._id}`}
                  key={course._id}
                  className="courses-card-link"
                >
                  <div className="courses-card">
                    <img
                      src={course.imageurl}
                      alt={course.title}
                      className="courses-image"
                    />
                    <div className="courses-card-content">
                      <h3>{course.title}</h3>
                      <p><strong>Instructor:</strong> {course.trainer?.fullName}</p>
                      <p><strong>Enrolled Learners:</strong> {course.learnerCount}</p>
                    </div>
                    <div className="btn-primary">Read More</div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No popular courses available</p>
            )}
          </div>
        )}
      </section>

      
      {/* Teach Section */}
      <section className="teach-section">
        <div className="teach-content">
          <div className="teach-text">
            <h2>Share your expertise on this platform</h2>
            <p>Share your knowledge and expertise with Learners around the world. Join our community of educators and help learners achieve their goals. Whether you're a seasoned professional or just starting, we welcome passionate individuals like you.</p>
            <Link to="/trainer-signup" className="btn-secondary">Become a Trainer</Link>
          </div>
          <div className="teach-image">
          <img src="https://hilms.onrender.com/uploads/istockphoto-1392125218-612x612.jpg" alt="Teaching Platform" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="testimonials-container">
        <h2>Learner Testimonials</h2>
        <div className="testimonial-slider">
          <button className="nav-button left" onClick={handlePrevClick}>
            <FaArrowLeft />
          </button>
          <div className="testimonial">
            <div className="image-container">
              <img className='testimonial-image' src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
            </div>
            <p className="quote">{testimonials[currentIndex].quote}</p>
            <p className="name">{testimonials[currentIndex].name}</p>
          </div>
          <button className="nav-button right" onClick={handleNextClick}>
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

export default Home;
