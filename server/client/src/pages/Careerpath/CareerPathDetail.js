// CareerPathDetail.js
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CareerPathDetail.css';

// Sample multi-level branched career path data with next connections
const branchedCareerPath = {
  id: 'operations-production',
  domain: 'Operations & Production Path',
  description: 'Lean manufacturing and production management career path.',
  levels: [
    [ // Level 1
      { id: 'l1-1', label: 'Foundation Level', roles: ['CNC Operator'], skills: ['Shop-floor Safety', '5S Principles', 'Machine Operations'], next: ['l2-1', 'l2-2'] },
    ],
    [ // Level 2
      { id: 'l2-1', label: 'Intermediate Role A', roles: ['Senior Technician – Die Tryout'], skills: ['Lean Manufacturing', 'Kaizen'], next: ['l3-1'] },
      { id: 'l2-2', label: 'Intermediate Role B', roles: ['Proposal Processing Engineer'], skills: ['Six Sigma Green Belt'], next: ['l3-2'] },
    ],
    [ // Level 3
      { id: 'l3-1', label: 'Advanced Skill A', roles: ['Estimation Engineer'], skills: ['ERP (SAP/Oracle)'], next: ['completed'] },
      { id: 'l3-2', label: 'Advanced Skill B', roles: ['Production Manager'], skills: ['Supply Chain Optimization'], next: ['completed'] },
    ],
    [ // Completed
      { id: 'completed', label: 'Completed Career Path', roles: [], skills: [], next: [] },
    ],
  ],
};

// Box component showing role/skills
const FlowchartBox = ({ label, roles, skills }) => (
  <div className="flowchart-branch-box">
    <h4>{label}</h4>
    {roles.length > 0 && (
      <>
        <strong>Roles:</strong>
        <ul>{roles.map((r, i) => <li key={i}>{r}</li>)}</ul>
      </>
    )}
    {skills.length > 0 && (
      <>
        <strong>Skills & Courses:</strong>
        <ul>{skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </>
    )}
  </div>
);

// Simple function to compute vertical spacing between rows for arrows
const getRowCenterY = (rowIndex, rowHeight, rowGap) => 
  rowIndex * (rowHeight + rowGap) + rowHeight / 2;

const MultiBranchFlowchart = ({ path }) => {
  const boxWidth = 250;
  const boxHeight = 170;
  const rowGap = 80;

  // Flatten all nodes to create map from id to position
  let positions = {};
  path.levels.forEach((row, rowIndex) => {
    row.forEach((node, nodeIndex) => {
      positions[node.id] = {
        x: nodeIndex * (boxWidth + 40) + 20,
        y: getRowCenterY(rowIndex, boxHeight, rowGap)
      };
    });
  });

  return (
    <div className="multi-branch-flowchart-container" style={{ position: 'relative', paddingBottom: '120px' }}>
      {path.levels.map((row, rowIndex) => (
        <div className="flowchart-row" key={rowIndex} style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: `${rowGap}px` }}>
          {row.map(node => (
            <FlowchartBox
              key={node.id}
              label={node.label}
              roles={node.roles}
              skills={node.skills}
            />
          ))}
        </div>
      ))}

      {/* SVG arrows between connected nodes */}
      <svg className="flowchart-svg-arrows" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
        {path.levels.flat().map(node => (
          node.next.map(nextId => {
            const from = positions[node.id];
            const to = positions[nextId];
            if (!from || !to) return null;
            const startX = from.x + boxWidth;
            const startY = from.y;
            const endX = to.x;
            const endY = to.y;

            // Draw simple curved arrow path
            const controlX = (startX + endX) / 2;
            const pathD = `M${startX},${startY} C${controlX},${startY} ${controlX},${endY} ${endX},${endY}`;
            const arrowSize = 8;

            // Arrowhead coordinates calculation
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowX1 = endX - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowY1 = endY - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrowX2 = endX - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowY2 = endY - arrowSize * Math.sin(angle + Math.PI / 6);

            return (
              <g key={`${node.id}-to-${nextId}`}>
                <path d={pathD} stroke="#4169e1" fill="none" strokeWidth="3" />
                <polygon points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="#4169e1" />
              </g>
            );
          })
        ))}
      </svg>
    </div>
  );
};


const CareerPathDetail = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // For demo: Using fixed branchedCareerPath data. Replace to use careerPaths list if needed.
  if (!branchedCareerPath || branchedCareerPath.id !== pathId) {
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
            fontSize: '1rem',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="career-detail-container">
      <h1>{branchedCareerPath.domain}</h1>
      <p className="career-detail-description">{branchedCareerPath.description}</p>

      {branchedCareerPath.levels.flat().map((level, idx) => (
        <div className="career-level-block" key={level.id}>
          <h2>{level.label}</h2>
          {level.roles.length > 0 && <p><strong>Roles:</strong> {level.roles.join(', ')}</p>}
          {level.skills.length > 0 && <p><strong>Skills & Courses:</strong> {level.skills.join(', ')}</p>}
        </div>
      ))}

      {/* Branched Career Flowchart Visualization */}
      <MultiBranchFlowchart path={branchedCareerPath} />

      <div className="career-soft-skills-block">
        <h3>Soft Skills</h3>
        <p>{branchedCareerPath.softSkills.join(', ')}</p>
      </div>

      <div className="career-detail-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-back">Back to Career Paths</button>
        <Link to="/signup" className="btn btn-join-now">Join Now</Link>
      </div>
    </section>
  );
};

export default CareerPathDetail;
