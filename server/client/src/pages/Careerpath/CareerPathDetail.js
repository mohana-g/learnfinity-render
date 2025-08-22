// CareerPathDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CareerPathDetail.css";

const CareerPathDetail = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPath = async () => {
      try {
        const res = await fetch(
          `https://hilms.onrender.com/api/career-paths/${pathId}`
        );
        if (!res.ok) throw new Error("Failed to fetch career path");
        const data = await res.json();
        setCareerPath(data.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [pathId]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading Career Path...</h2>
      </div>
    );
  }

  if (!careerPath) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Career Path Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "1rem",
            cursor: "pointer",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#2c3a93",
            color: "white",
            fontSize: "1rem",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="career-detail-container">
      <h1>{careerPath.title}</h1>
      <p className="career-detail-description">{careerPath.description}</p>

      <h2>Courses in this Path</h2>
      {careerPath.levels?.map((level, idx) => (
        <div key={idx}>
          <h3>{level.name}</h3>
          {level.courses?.length > 0 ? (
            <ul>
              {level.courses.map((course) => (
                <li key={course._id}>{course.title}</li>
              ))}
            </ul>
          ) : (
            <p>No courses in this level.</p>
          )}
        </div>
      ))}

      <div className="career-detail-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-back">
          Back to Career Paths
        </button>
        <Link to="/signup" className="btn btn-join-now">
          Join Now
        </Link>
      </div>
    </section>
  );
};

export default CareerPathDetail;
