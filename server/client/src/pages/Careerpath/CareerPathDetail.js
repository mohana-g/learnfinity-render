// CareerPathDetail.js
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import './CareerPathDetail.css'; // Assuming you have a CSS file for styling

// Full Career Paths data (ideally move this to a shared file)
const careerPaths = [
  {
    id: 'technical-engineering',
    domain: 'Technical / Engineering Path',
    description: 'Explore technical design, robotics, and manufacturing roles.',
    levels: [
      {
        name: 'Foundation',
        roles: ['Graduate Engineer Trainee'],
        skills: ['CAD/CAM (AutoCAD, CATIA, SolidWorks)', 'Basics of Manufacturing'],
      },
      {
        name: 'Intermediate',
        roles: [
          'BIW Design Engineer',
          'Design Engineer',
          'Die Design Engineer',
          'Project Engineer – Controls',
          'Robotics Engineer'
        ],
        skills: ['Robotics', 'PLC programming', 'CNC operations', 'IoT in Manufacturing'],
      },
      {
        name: 'Advanced',
        roles: ['Senior Engineer / Subject Matter Expert (SME)'],
        skills: ['AI in Manufacturing', 'Digital Twin', 'Industry 4.0', 'Data Analytics for Engineers'],
      }
    ],
    softSkills: ['Problem-Solving', 'Innovation', 'Design Thinking', 'Communication']
  },
  {
    id: 'operations-production',
    domain: 'Operations & Production Path',
    description: 'Lean manufacturing and production management career path.',
    levels: [
      {
        name: 'Foundation',
        roles: ['CNC Operator'],
        skills: ['Shop-floor Safety', '5S Principles', 'Machine Operations'],
      },
      {
        name: 'Intermediate',
        roles: ['Senior Technician – Die Tryout', 'Proposal Processing Engineer', 'Estimation Engineer'],
        skills: ['Lean Manufacturing', 'Kaizen', 'Six Sigma Green Belt'],
      },
      {
        name: 'Advanced',
        roles: ['Production/Operations Manager'],
        skills: ['ERP (SAP/Oracle)', 'Supply Chain Optimization', 'Maintenance Planning'],
      },
    ],
    softSkills: ['Teamwork', 'Adaptability', 'Workplace Collaboration', 'Stress Management']
  },
  {
    id: 'managerial',
    domain: 'Managerial Path',
    description: 'Path to leadership with project and people management skills.',
    levels: [
      {
        name: 'Foundation',
        roles: ['Project Engineer (with leadership responsibilities)', 'Project Manager'],
        skills: ['People Management', 'Conflict Resolution', 'Emotional Intelligence', 'Agile', 'Scrum', 'PMP', 'JIRA/MS Project'],
      },
      {
        name: 'Intermediate',
        roles: ['Senior Manager'],
        skills: ['Strategic Thinking', 'KPI & Metrics Analysis']
      },
      {
        name: 'Advanced',
        roles: ['Director / General Manager'],
        skills: ['Change Management', 'Global Supply Chain Leadership'],
      },
    ],
    softSkills: ['Decision-Making', 'Negotiation', 'Time Management', 'Communication']
  },
  {
    id: 'quality-process-excellence',
    domain: 'Quality & Process Excellence Path',
    description: 'Quality control, auditing, and process improvement roles.',
    levels: [
      {
        name: 'Foundation',
        roles: ['Quality Inspector'],
        skills: ['Basics of Quality Control', 'ISO Standards', 'SPC (Statistical Process Control)'],
      },
      {
        name: 'Intermediate',
        roles: ['Quality Engineer', 'Senior Quality Engineer'],
        skills: ['Root Cause Analysis', 'FMEA', 'Six Sigma Green Belt']
      },
      {
        name: 'Advanced',
        roles: ['Quality Manager / Head of Quality'],
        skills: ['Six Sigma Black Belt', 'TQM', 'Internal/External Auditing Techniques'],
      },
    ],
    softSkills: ['Analytical Thinking', 'Report Writing', 'Critical Observation', 'Presentation Skills']
  },
  {
    id: 'it-digital-transformation',
    domain: 'IT & Digital Transformation Path',
    description: 'Programming, cloud, cybersecurity and AI in manufacturing.',
    levels: [
      {
        name: 'Foundation',
        roles: ['Software Engineer – Programming Services'],
        skills: ['HTML', 'CSS', 'JavaScript', 'Python/Java', 'SQL'],
      },
      {
        name: 'Intermediate',
        roles: ['System Analyst (future role)', 'Solution Architect'],
        skills: ['React/Angular', 'Node.js', 'Cloud (AWS, Azure)', 'ERP Systems (SAP)'],
      },
      {
        name: 'Advanced',
        roles: ['Chief Digital Officer (long-term growth)'],
        skills: ['Cybersecurity', 'DevOps', 'Data Science', 'AI/ML in Manufacturing'],
      },
    ],
    softSkills: ['Technical Documentation', 'Problem-Solving', 'Continuous Learning', 'Creativity']
  },
  {
    id: 'learning-development-hr',
    domain: 'Learning & Development / HR Path',
    description: 'Career focused on HR, training, talent and organizational development.',
    levels: [
      {
        name: 'Foundation',
        roles: ['HR / L&D Coordinator'],
        skills: ['HR Basics', 'Employee Engagement', 'Training Needs Analysis'],
      },
      {
        name: 'Intermediate',
        roles: ['Training Specialist', 'HR / L&D Manager'],
        skills: ['HR Analytics', 'Talent Management', 'Leadership Development Programs'],
      },
      {
        name: 'Advanced',
        roles: ['Head of HR / Organizational Development'],
        skills: ['Organizational Development', 'HR Strategy & Policies', 'Change Management'],
      },
    ],
    softSkills: ['Empathy', 'Coaching & Mentoring', 'Negotiation', 'Communication', 'People Development']
  }
];


const CareerPathDetail = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    }, []);
    
  const careerPath = careerPaths.find((path) => path.id === pathId);

  if (!careerPath) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Career Path Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '1rem',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2c3a93',
            color: 'white',
            fontSize: '1rem'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="career-detail-container">
      <h1>{careerPath.domain}</h1>
      <p className="career-detail-description">{careerPath.description}</p>

      {careerPath.levels.map((level, idx) => (
        <div className="career-level-block" key={idx}>
          <h2>{level.name} Level</h2>
          <p><strong>Roles:</strong> {level.roles.join(', ')}</p>
          <p><strong>Skills & Courses:</strong> {level.skills.join(', ')}</p>
        </div>
      ))}

      <div className="career-soft-skills-block">
        <h3>Soft Skills</h3>
        <p>{careerPath.softSkills.join(', ')}</p>
      </div>

      <div className="career-detail-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-back">Back to Career Paths</button>
        <Link to="/signup" className="btn btn-join-now">Join Now</Link>
      </div>
    </section>
  );
};

export default CareerPathDetail;
