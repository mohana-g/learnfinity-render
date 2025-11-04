import React, { useState } from 'react';
// import { FaInstagram, FaFacebookF, FaTwitter} from 'react-icons/fa';
import './LearnerAbout.css';

const About = () => {
  
     const [loading, setLoading] = useState(true);
  
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Us Page</h1>
      </header>
      <section className="about-content">
        <div className="about-left">
          {loading && <div className="skeleton skeleton-course-aboimg"></div>}
          <img
            src="https://hilms.onrender.com/uploads/e90af6d9-1036-48b5-ac3d-6a2391bd6009.png"
            alt="Education Illustration"
            className="about-image"
            onLoad={() => setLoading(false)}
            style={{ display: loading ? "none" : "block" }}
          />
        </div>
       <div className="about-right">
         <h2>Welcome to HIROTEC Learnfinity Portal – Your Partner in Professional Growth</h2>
          <p>
            At HIROTEC Learnfinity, we believe that learning never stops. Our comprehensive Learning Management System (LMS) is designed for working professionals, organizations, and teams who aim to stay ahead in today's fast-paced business world.
          </p>
          <p>
            This platform empowers the organization with powerful tools to create, manage, and track learning initiatives. With features like customizable learning paths, real-time progress tracking, and detailed analytics dashboards, managers gain complete visibility into their team's development journey.
          </p>
          <p>
            From leadership development to technical upskilling, our curated courses are crafted by industry experts to meet real-world challenges. Organizations benefit from centralized content management, automated certification tracking, and seamless collaboration tools that foster a culture of continuous learning.
          </p>
          <p>
            Whether you're looking to improve your professional skills, train your workforce, or explore new career opportunities, Learnfinity provides the tools, resources, and support you need to succeed. Our LMS streamlines training administration, reduces costs, and delivers measurable ROI through improved employee performance and retention.
          </p>
          <p><strong>Empower your career, empower your future.</strong></p>
          <div className="about-features">
          <div className="feature-card">
            <span className="emoji">📊</span>
            Business & Leadership Training
          </div>
          <div className="feature-card">
            <span className="emoji">💻</span>
            Technology & Software Skills
          </div>
          <div className="feature-card">
            <span className="emoji">📜</span>
            Accredited Certifications
          </div>
          <div className="feature-card">
            <span className="emoji">🤝</span>
            Corporate Collaboration Tools
          </div>
        </div>
      </div>
      </section>

      {/* <section className="about-instructors-section">
        <h2>Meet Our Expert Instructors</h2>
        <div className="about-instructors-container">
          <div className="about-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-character-developer-working-laptop-web-app-development-frontend-deployment_1298309-24267.jpg?w=360"
              alt="Kevin"
              className="about-instructor-image"
            />
            <h3>Kevin</h3>
            <p className="about-instructor-title">Web Development</p>
            <p>
              As a seasoned Web Developer, I bring a wealth of experience in
              harnessing the power of data to drive informed decision-making and
              optimize online strategies. With a track record of 9 years in the
              field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="about-social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="about-social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="about-social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="about-social-icon" />
              </a>
            </div>
          </div>

          <div className="about-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/3d-cartoon-using-laptops-sitting-chairs-cute-cartoon-working-playing-social-media-technology-futuristic-poster-ai-generative_43969-5403.jpg"
              alt="Max"
              className="about-instructor-image"
            />
            <h3>Max</h3>
            <p className="about-instructor-title">Data Analyst</p>
            <p>
              As a seasoned Data Analyst, I bring a wealth of experience in
              harnessing the power of data to drive informed decision-making and
              optimize online strategies. With a track record of 6 years in the
              field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="about-social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="about-social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="about-social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="about-social-icon" />
              </a>
            </div>
          </div>

          <div className="about-instructor-card">
            <img
              src="https://img.freepik.com/premium-photo/young-woman-using-laptop-3d-character-illustration_839035-210525.jpg?w=360"
              alt="Linda"
              className="about-instructor-image"
            />
            <h3>Linda</h3>
            <p className="about-instructor-title">Full Stack Developer</p>
            <p>
              As a seasoned Full Stack Developer, I bring a wealth of experience
              in harnessing the power of data to drive informed decision-making
              and optimize online strategies. With a track record of 5 years in
              the field, I have honed my skills in collecting, processing, and
              analyzing web data to extract valuable insights that propel
              businesses forward.
            </p>
            <div className="about-social-icons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="about-social-icon" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="about-social-icon" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="about-social-icon" />
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;
