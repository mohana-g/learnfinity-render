// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// // import { FaInstagram, FaFacebookF, FaTwitter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// // import User1 from '../../assets/User1.jpg';
// // import User2 from '../../assets/User2.jpg';
// // import User3 from '../../assets/User3.avif';
// // import User4 from '../../assets/User4.avif';
// // import User5 from '../../assets/User5.avif';
// import './Home.css';

// // Add this above your Home component
// const HomeCourseSkeleton = () => (
//   <div className="courses-card skeleton-card">
//     <div className="skeleton skeleton-course-img"></div>
//     <div className="courses-card-content">
//       <div className="skeleton skeleton-course-title"></div>
//       <div className="skeleton skeleton-course-meta"></div>
//       <div className="skeleton skeleton-course-meta"></div>
//     </div>
//     <div className="skeleton skeleton-course-btn"></div>
//   </div>
// );

// function Home() {
//   // const [currentIndex, setCurrentIndex] = useState(0);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

  
//   // const testimonials = [
//   //   {
//   //     name: 'Preetham',
//   //     quote: "I've learned so much from this platform. The courses are top-notch, and the instructors are experts in their fields.",
//   //     image: User5,
//   //   },
//   //   {
//   //     name: 'Chaitanya',
//   //     quote: 'The interactive lessons and quizzes have made my learning experience enjoyable and effective. I highly recommend it!',
//   //     image: User4,
//   //   },
//   //   {
//   //     name: 'Abhishikth',
//   //     quote: "This e-learning platform has been a game-changer for me. It's convenient, flexible, and has helped me advance in my career.",
//   //     image: User3,
//   //   },
//   //   {
//   //     name: 'Narasimha',
//   //     quote: "I can't believe how much I've grown as a learner. The variety of courses is impressive, and the support is outstanding.",
//   //     image: User1,
//   //   },
//   //   {
//   //     name: 'Manjith',
//   //     quote: "The quality of education here is unmatched. I'm grateful for the opportunity to expand my knowledge and skills.",
//   //     image: User2,
//   //   },
//   // ];

//   // const handlePrevClick = () => {
//   //   setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
//   // };

//   // const handleNextClick = () => {
//   //   setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
//   // };

//   // Fetch popular courses sorted by number of enrolled Learners
//   const fetchPopularCourses = async () => {
//     try {
//       const response = await fetch('https://hilms.onrender.com/api/courses/popular');
//       if (!response.ok) {
//         throw new Error('Failed to fetch popular courses');
//       }
//       const data = await response.json();
//       setCourses(data.data);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPopularCourses();
//   }, []);


//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1>Unlock Your Potential</h1>
//           {/* <p>Learn, Grow, and Excel with Our Online Courses</p>
//           <p>Get Educated Online From Your Home. Register now and Enroll in the courses to break records.</p> */}
//           <Link to="/signup" className="btn-primary">Join Now</Link>
//         </div>
//       </section>
//       {/* Popular Courses */}
//       <section className="courses-section">
//         <h2>Popular Courses</h2>
//         {loading ? (
//           <div className="courses-container-cards">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <HomeCourseSkeleton key={i} />
//             ))}
//           </div>
//         ) : (
//           <div className="courses-container-cards">
//             {courses.length > 0 ? (
//               courses.slice(0, 4).map((course) => (
//                 <Link
//                   to={`/course-details/${course._id}`}
//                   key={course._id}
//                   className="courses-card-link"
//                 >
//                   <div className="courses-card">
//                     <img
//                       src={course.imageurl}
//                       alt={course.title}
//                       className="courses-image"
//                     />
//                     <div className="courses-card-content">
//                       <h3>{course.title}</h3>
//                       <p><strong>Instructor:</strong> {course.trainer?.fullName}</p>
//                       <p><strong>Enrolled Learners:</strong> {course.learnerCount}</p>
//                     </div>
//                     <div className="btn-primary">Read More</div>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <p>No popular courses available</p>
//             )}
//           </div>
//         )}
//       </section>

      
//       {/* Teach Section */}
//       <section className="teach-section">
//         <div className="teach-content">
//           <div className="teach-text">
//             <h2>Share your expertise on this platform</h2>
//             <p>Share your knowledge and expertise with Learners around the world. Join our community of educators and help learners achieve their goals. Whether you're a seasoned professional or just starting, we welcome passionate individuals like you.</p>
//             <Link to="/trainer-signup" className="btn-secondary">Become a Trainer</Link>
//           </div>
//           <div className="teach-image">
//           <img src="https://hilms.onrender.com/uploads/istockphoto-1392125218-612x612.jpg" alt="Teaching Platform" />
//           </div>
//         </div>
//       </section>
        
//       {/* Testimonials Section */}
//       {/* <section className="testimonials-container">
//         <h2>Learner Testimonials</h2>
//         <div className="testimonial-slider">
//           <button className="nav-button left" onClick={handlePrevClick}>
//             <FaArrowLeft />
//           </button>
//           <div className="testimonial">
//             <div className="image-container">
//               <img className='testimonial-image' src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
//             </div>
//             <p className="quote">{testimonials[currentIndex].quote}</p>
//             <p className="name">{testimonials[currentIndex].name}</p>
//           </div>
//           <button className="nav-button right" onClick={handleNextClick}>
//             <FaArrowRight />
//           </button>
//         </div>
//       </section> */}

//       {/* Expert Instructors Section */}
//       {/* <section className="expert-instructors-section">
//         <h2>Expert Instructors</h2>
//         <div className="instructors-container">
//           <div className="instructor-card">
//             <img
//               src="https://img.freepik.com/premium-photo/3d-cartoon-character-developer-working-laptop-web-app-development-frontend-deployment_1298309-24267.jpg?w=360"
//               alt="Kevin"
//               className="instructor-image"
//             />
//             <h3>Kevin</h3>
//             <p className="instructor-title">Web Development</p>
//             <p>
//               As a seasoned Web Developer, I bring a wealth of experience in
//               harnessing the power of data to drive informed decision-making and
//               optimize online strategies. With a track record of 9 years in the
//               field, I have honed my skills in collecting, processing, and
//               analyzing web data to extract valuable insights that propel
//               businesses forward.
//             </p>
//             <div className="social-icons">
//               <a
//                 href="https://www.instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaInstagram className="social-icon" />
//               </a>
//               <a
//                 href="https://www.facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaFacebookF className="social-icon" />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaTwitter className="social-icon" />
//               </a>
//             </div>
//           </div>

//           <div className="instructor-card">
//             <img
//               src="https://img.freepik.com/premium-photo/3d-cartoon-using-laptops-sitting-chairs-cute-cartoon-working-playing-social-media-technology-futuristic-poster-ai-generative_43969-5403.jpg"
//               alt="Max"
//               className="instructor-image"
//             />
//             <h3>Max</h3>
//             <p className="instructor-title">Data Analyst</p>
//             <p>
//               As a seasoned Data Analyst, I bring a wealth of experience in
//               harnessing the power of data to drive informed decision-making and
//               optimize online strategies. With a track record of 6 years in the
//               field, I have honed my skills in collecting, processing, and
//               analyzing web data to extract valuable insights that propel
//               businesses forward.
//             </p>
//             <div className="social-icons">
//               <a
//                 href="https://www.instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaInstagram className="social-icon" />
//               </a>
//               <a
//                 href="https://www.facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaFacebookF className="social-icon" />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaTwitter className="social-icon" />
//               </a>
//             </div>
//           </div>

//           <div className="instructor-card">
//             <img
//               src="https://img.freepik.com/premium-photo/young-woman-using-laptop-3d-character-illustration_839035-210525.jpg?w=360"
//               alt="Linda"
//               className="instructor-image"
//             />
//             <h3>Linda</h3>
//             <p className="instructor-title">Full Stack Developer</p>
//             <p>
//               As a seasoned Full Stack Developer, I bring a wealth of experience
//               in harnessing the power of data to drive informed decision-making
//               and optimize online strategies. With a track record of 5 years in
//               the field, I have honed my skills in collecting, processing, and
//               analyzing web data to extract valuable insights that propel
//               businesses forward.
//             </p>
//             <div className="social-icons">
//               <a
//                 href="https://www.instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaInstagram className="social-icon" />
//               </a>
//               <a
//                 href="https://www.facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaFacebookF className="social-icon" />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaTwitter className="social-icon" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </section> */}
//     </div>
//   );
// }

// export default Home;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

// Popular courses skeleton card
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

// HIROTEC India Career Paths Data
const careerPaths = [
  {
    domain: "Technical / Engineering Path",
    levels: [
      {
        name: "Foundation",
        roles: ["Graduate Engineer Trainee"],
        skills: [
          "CAD/CAM (AutoCAD, CATIA, SolidWorks)",
          "Basics of Manufacturing"
        ],
      },
      {
        name: "Intermediate",
        roles: [
          "BIW Design Engineer",
          "Design Engineer",
          "Die Design Engineer",
          "Project Engineer – Controls",
          "Robotics Engineer",
        ],
        skills: [
          "Robotics",
          "PLC programming",
          "CNC operations",
          "IoT in Manufacturing"
        ],
      },
      {
        name: "Advanced",
        roles: ["Senior Engineer / Subject Matter Expert (SME)"],
        skills: [
          "AI in Manufacturing",
          "Digital Twin",
          "Industry 4.0",
          "Data Analytics for Engineers"
        ],
      },
    ],
    softSkills: ["Problem-Solving", "Innovation", "Design Thinking", "Communication"]
  },
  {
    domain: "Operations & Production Path",
    levels: [
      {
        name: "Foundation",
        roles: ["CNC Operator"],
        skills: [
          "Shop-floor Safety",
          "5S Principles",
          "Machine Operations"
        ],
      },
      {
        name: "Intermediate",
        roles: [
          "Senior Technician – Die Tryout",
          "Proposal Processing Engineer",
          "Estimation Engineer",
        ],
        skills: [
          "Lean Manufacturing",
          "Kaizen",
          "Six Sigma Green Belt"
        ],
      },
      {
        name: "Advanced",
        roles: ["Production/Operations Manager"],
        skills: [
          "ERP (SAP/Oracle)",
          "Supply Chain Optimization",
          "Maintenance Planning"
        ],
      },
    ],
    softSkills: ["Teamwork", "Adaptability", "Workplace Collaboration", "Stress Management"]
  },
  {
    domain: "Managerial Path",
    levels: [
      {
        name: "Foundation",
        roles: [
          "Project Engineer (with leadership responsibilities)",
          "Project Manager"
        ],
        skills: [
          "People Management",
          "Conflict Resolution",
          "Emotional Intelligence",
          "Agile",
          "Scrum",
          "PMP",
          "JIRA/MS Project"
        ],
      },
      {
        name: "Intermediate",
        roles: ["Senior Manager"],
        skills: [
          "Strategic Thinking",
          "KPI & Metrics Analysis"
        ]
      },
      {
        name: "Advanced",
        roles: ["Director / General Manager"],
        skills: [
          "Change Management",
          "Global Supply Chain Leadership"
        ],
      },
    ],
    softSkills: ["Decision-Making", "Negotiation", "Time Management", "Communication"]
  },
  {
    domain: "Quality & Process Excellence Path",
    levels: [
      {
        name: "Foundation",
        roles: ["Quality Inspector"],
        skills: [
          "Basics of Quality Control",
          "ISO Standards",
          "SPC (Statistical Process Control)"
        ],
      },
      {
        name: "Intermediate",
        roles: [
          "Quality Engineer",
          "Senior Quality Engineer"
        ],
        skills: [
          "Root Cause Analysis",
          "FMEA",
          "Six Sigma Green Belt"
        ]
      },
      {
        name: "Advanced",
        roles: ["Quality Manager / Head of Quality"],
        skills: [
          "Six Sigma Black Belt",
          "TQM",
          "Internal/External Auditing Techniques"
        ],
      },
    ],
    softSkills: ["Analytical Thinking", "Report Writing", "Critical Observation", "Presentation Skills"]
  },
  {
    domain: "IT & Digital Transformation Path",
    levels: [
      {
        name: "Foundation",
        roles: ["Software Engineer – Programming Services"],
        skills: [
          "HTML",
          "CSS",
          "JavaScript",
          "Python/Java",
          "SQL"
        ],
      },
      {
        name: "Intermediate",
        roles: [
          "System Analyst (future role)",
          "Solution Architect"
        ],
        skills: [
          "React/Angular",
          "Node.js",
          "Cloud (AWS, Azure)",
          "ERP Systems (SAP)"
        ],
      },
      {
        name: "Advanced",
        roles: ["Chief Digital Officer (long-term growth)"],
        skills: [
          "Cybersecurity",
          "DevOps",
          "Data Science",
          "AI/ML in Manufacturing"
        ],
      },
    ],
    softSkills: ["Technical Documentation", "Problem-Solving", "Continuous Learning", "Creativity"]
  },
  {
    domain: "Learning & Development / HR Path",
    levels: [
      {
        name: "Foundation",
        roles: ["HR / L&D Coordinator"],
        skills: [
          "HR Basics",
          "Employee Engagement",
          "Training Needs Analysis"
        ],
      },
      {
        name: "Intermediate",
        roles: [
          "Training Specialist",
          "HR / L&D Manager"
        ],
        skills: [
          "HR Analytics",
          "Talent Management",
          "Leadership Development Programs"
        ],
      },
      {
        name: "Advanced",
        roles: ["Head of HR / Organizational Development"],
        skills: [
          "Organizational Development",
          "HR Strategy & Policies",
          "Change Management"
        ],
      },
    ],
    softSkills: [
      "Empathy",
      "Coaching & Mentoring",
      "Negotiation",
      "Communication",
      "People Development"
    ]
  }
];

// CareerFlowchart Component
const CareerFlowchart = () => {
  const navigate = useNavigate();

  return (
    <section className="career-flowchart-section">
      <h2>HIROTEC India Career Paths</h2>
      <p className="career-flowchart-subtitle">
        Explore detailed career paths with roles and skills, from foundation to advanced levels.
      </p>

      <div className="career-flowchart-cards">
        {careerPaths.map((path, idx) => (
          <div key={idx} className="career-path-card">
            <h3 className="career-path-title">{path.domain}</h3>
            <div className="levels-container">
              {path.levels.map((level, i) => (
                <div key={i} className="career-level-section">
                  <h4 className="career-level-name">{level.name}</h4>
                  <p><strong>Roles:</strong> {level.roles.join(', ')}</p>
                  <p><strong>Skills & Courses:</strong> {level.skills.join(', ')}</p>
                </div>
              ))}
            </div>
            <p className="career-soft-skills">
              <strong>Soft Skills:</strong> {path.softSkills.join(', ')}
            </p>

            <div className="career-buttons">
              <button
                className="btn-read-more"
                onClick={() => navigate(`/career-paths/${idx}`)} // Adjust route as necessary
              >
                Read More
              </button>
              <button
                className="btn-join-now"
                onClick={() => window.location.href = "https://hilms.onrender.com/signup"}
              >
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main Home Component
function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <p>
              Share your knowledge and expertise with Learners around the world.
              Join our community of educators and help learners achieve their goals.
              Whether you're a seasoned professional or just starting, we welcome passionate individuals like you.
            </p>
            <Link to="/trainer-signup" className="btn-secondary">Become a Trainer</Link>
          </div>
          <div className="teach-image">
            <img
              src="https://hilms.onrender.com/uploads/istockphoto-1392125218-612x612.jpg"
              alt="Teaching Platform"
            />
          </div>
        </div>
      </section>

      {/* Career Paths Section */}
      <CareerFlowchart />
    </div>
  );
}

export default Home;

