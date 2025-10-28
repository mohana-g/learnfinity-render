// // CareerPathDetail.js
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import "./CareerPathDetail.css";

// const CareerPathDetail = () => {
//   const { pathId } = useParams();
//   const navigate = useNavigate();
//   const [careerPath, setCareerPath] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     const fetchPath = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/career-paths/${pathId}`
//         );
//         if (!res.ok) throw new Error("Failed to fetch career path");
//         const data = await res.json();
//         setCareerPath(data.data);
//       } catch (err) {
//         console.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPath();
//   }, [pathId]);

//   if (loading) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Loading Career Path...</h2>
//       </div>
//     );
//   }

//   if (!careerPath) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Career Path Not Found</h2>
//         <button
//           onClick={() => navigate(-1)}
//           style={{
//             marginTop: "1rem",
//             cursor: "pointer",
//             padding: "10px 20px",
//             borderRadius: "6px",
//             border: "none",
//             backgroundColor: "#2c3a93",
//             color: "white",
//             fontSize: "1rem",
//           }}
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <section className="career-detail-container">
//       <h1>{careerPath.title}</h1>
//       <p className="career-detail-description">{careerPath.description}</p>

//       <h2>Courses in this Path</h2>
//       {careerPath.levels?.map((level, idx) => (
//         <div key={idx}>
//           <h3>{level.name}</h3>
//           {level.courses?.length > 0 ? (
//             <ul>
//               {level.courses.map((course) => (
//                 <li key={course._id}>{course.title}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No courses in this level.</p>
//           )}
//         </div>
//       ))}

//       <div className="career-detail-buttons">
//         <button onClick={() => navigate(-1)} className="btn btn-back">
//           Back to Career Paths
//         </button>
//         <Link to="/signup" className="btn btn-join-now">
//           Join Now
//         </Link>
//       </div>
//     </section>
//   );
// };

// export default CareerPathDetail;


// CareerPathDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CareerPathDetail.css";

const CareerPathDetailSkeleton = () => (
  <section className="career-detail-scontainer">
    <header className="career-path-sheader-page">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-meta" />
      <div className="skeleton skeleton-meta" />
    </header>

    <h2 className="section-stitle">
      <div className="skeleton skeleton-section-title" />
    </h2>

    <div className="course-list">
      {[1, 2].map((i) => (
        <div className="career-scourse-card" key={i}>
          <div className="skeleton skeleton-image" />
          <div className="course-info">
            <div className="skeleton skeleton-ctitle" />
            <div className="skeleton skeleton-meta" />
            <div className="skeleton skeleton-meta" />
            <div className="skeleton skeleton-meta" />
            <div className="skeleton skeleton-meta" />
            <div className="skeleton skeleton-meta" />
            <div className="skeleton skeleton-block" />
            <div className="skeleton skeleton-block" />
          </div>
        </div>
      ))}
    </div>

    <div className="career-sdetail-buttons">
      <div className="skeleton skeleton-btn" />
      <div className="skeleton skeleton-btn" />
    </div>
  </section>
);

const CareerPathDetail = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [learnerProgress, setLearnerProgress] = useState([]);


  useEffect(() => {
  window.scrollTo(0, 0);

  const fetchPath = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/career-paths/${pathId}`
      );
      if (!res.ok) throw new Error("Failed to fetch career path");
      const data = await res.json();
      setCareerPath(data.data);

      // 🔹 Fetch learner progress if logged in
      if (localStorage.getItem("role") === "learner") {
        const token = localStorage.getItem("token");
        const progressRes = await fetch(
          `http://localhost:5000/api/learner/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setLearnerProgress(progressData.enrolledCourses);
        }
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPath();
}, [pathId]);


  if (loading) {
    return <CareerPathDetailSkeleton />;
  }

  if (!careerPath) {
    return (
      <div className="career-not-found">
        <h2>Career Path Not Found</h2>
        <button onClick={() => navigate(-1)} className="btn btn-back">
          Go Back
        </button>
      </div>
    );
  }

  // ✅ Overall completion check
  const allCompleted =
    learnerProgress.length > 0 &&
    careerPath.courses.every((courseRef) =>
      learnerProgress.some(
        (p) =>
          p.courseTitle === courseRef.courseId.title &&
          Number(p.progressPercent) === 100
      )
    );

  return (
    <section className="career-detail-container">
      <header className="career-path-header-page">
        <h1>{careerPath.title}</h1>
        <p className="career-detail-description">{careerPath.description}</p>

        <div className="career-meta">
          {/* <p><strong>Duration:</strong> {careerPath.duration}</p> */}
          {careerPath.roles?.length > 0 && (
            <p><strong>Roles:</strong> {careerPath.roles.join(", ")}</p>
          )}
          {/* {careerPath.skillsLearnt?.length > 0 && (
            <p>
              <strong>Skills:</strong>{" "}
              {careerPath.skillsLearnt.join(", ")}
            </p>
          )} */}
        </div>
      </header>

      <h2 className="section-title">Courses</h2>
      <div className="course-list">
        {careerPath.courses?.map((courseRef, idx) => {
          const course = courseRef.courseId;
          let courseProgress = null;
          if (localStorage.getItem("role") === "learner") {
          courseProgress = learnerProgress.find(
            (p) => p.courseTitle === course.title
          );


          }

              const isCompleted = Number(courseProgress?.progressPercent) === 100;
                        return (
                          <div
                className={`career-course-card ${isCompleted ? "completed-card" : ""}`}
                key={idx}
              >
              <img
                src={course.imageurl}
                alt={course.title}
                className="course-img"
              />
              <div className="course-info">
                <h3>{course.title}</h3>

              {courseProgress && (
                <div className="progress-container">
                  <p><strong>Progress:</strong> {courseProgress.progressPercent}%</p>
                  <div className="career-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${courseProgress.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}


                {isCompleted && <span className="completed-badge">✅ Course Completed</span>}
                
                <p>{course.description}</p>
                <p><strong>Level:</strong> {courseRef.level}</p>
                <p><strong>Duration:</strong> {courseRef.duration}</p>
                {courseRef.skillsLearnt?.length > 0 && (
                  <p>
                    <strong>Skills Learnt:</strong>{" "}
                    {courseRef.skillsLearnt.join(", ")}
                  </p>
                )}

                {course.trainer && (
                  <div className="trainer-info-path">
                    {/* <img
                      src={course.trainer.profileImage}
                      alt={course.trainer.fullName}
                      className="trainer-img"
                    /> */}
                    <div>
                      <strong>Trainer Name: </strong>{course.trainer.full_name}
                      {/* <p>{course.trainer.bio}</p> */}
                    </div>
                  </div>
                )}

                {course.chapters?.length > 0 && (
                  <div className="chapters">
                    <h4>Chapters</h4>
                    <ol>
                      {course.chapters.map((ch) => (
                        <li key={ch.id}>
                          <strong>{ch.name}</strong>
                          {ch.lessons?.length > 0 && (
                            <ul className="lessons">
                              {ch.lessons.map((lesson) => (
                                <li key={lesson.id}>
                                  {lesson.title} ({lesson.duration})
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="career-detail-buttons">
      <button onClick={() => navigate(-1)} className="btn btn-back">
        Back to Career Paths
      </button>

      {localStorage.getItem("role") === "learner" ? (
        allCompleted ? (
          <div className="all-completed-text">
            🎉 All Courses Completed
          </div>
        ) : (
          <Link to="/learner-dashboard/courses" className="btn btn-go-courses">
            Go to Courses
          </Link>
        )
      ) : (
        <Link to="/signup" className="btn btn-join-now">
          Join Now
        </Link>
      )}

    </div>


      {/* <div className="career-detail-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-back">
          Back to Career Paths
        </button>
        <Link to="/signup" className="btn btn-join-now">
          Join Now
        </Link>
      </div> */}
    </section>
  );
};

export default CareerPathDetail;
