// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./Courses.css";

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [sortOption, setSortOption] = useState("");

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch("https://hilms.onrender.com/api/courses"); // Backend API URL
//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }
//         const data = await response.json();
//         setCourses(data.data || []); // Ensure only the array is stored
//       } catch (error) {
//         console.error(error.message);
//       }
//     };    

//     fetchCourses();
//   }, []);

//   const handleSortChange = (event) => {
//     setSortOption(event.target.value);
//   };

//   const handleSortButtonClick = () => {
//     const sortedCourses = [...courses].sort((a, b) => {
//       if (sortOption === "title-asc") {
//         return a.title.localeCompare(b.title);
//       } else if (sortOption === "title-desc") {
//         return b.title.localeCompare(a.title);
//       }
//       return 0;
//     });

//     setCourses(sortedCourses);
//   };

//   return (
//     <div className="courses-page">
//       <h2>Courses Page</h2>

//       {/* Sorting options */}
//       <div className="courses-page-sort-by">
//         <span>Sort by:</span>
//         <select value={sortOption} onChange={handleSortChange}>
//           <option value="">Select an option</option>
//           <option value="title-asc">Title: A to Z</option>
//           <option value="title-desc">Title: Z to A</option>
//         </select>
//         <button onClick={handleSortButtonClick}>Sort</button>
//       </div>

//       {/* Display courses if available, or show 'No courses available' message */}
//       <section className="courses-page-section">
//       <div className="courses-page-container-cards">
//         {courses.length > 0 ? (
//           courses.map((course) => (
//             <Link
//               to={`/course-details/${course._id}`}
//               key={course._id}
//               className="general-courses-card-link"
//             >
//               <div className="courses-page-card">
//                 <img
//                   src={course.imageurl}
//                   alt={course.title}
//                   className="courses-page-image"
//                 />
//                 <h3>{course.title}</h3>
//                 <p>
//                   <strong>Instructor:</strong>{" "}
//                   {course.trainer?.fullName || "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Enrolled Learners:</strong>{" "}
//                   {course.learners?.length || 0}
//                 </p>
//                 <span className="btn-primary">Read More</span>
//               </div>
//             </Link>
//           ))
//           ) : (
//             <p>No courses available</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CoursesPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./Courses.css";

// // Skeleton card component
// const CourseCardSkeleton = () => {
//   return (
//     <div className="courses-page-card skeleton-card">
//       <div className="skeleton-image"></div>
//       <div className="skeleton-text short"></div>
//       <div className="skeleton-text long"></div>
//       <div className="skeleton-text long"></div>
//       <div className="skeleton-btn"></div>
//     </div>
//   );
// };

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [sortOption, setSortOption] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch("https://hilms.onrender.com/api/courses");
//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }
//         const data = await response.json();
//         setCourses(data.data || []);
//       } catch (error) {
//         console.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleSortChange = (event) => {
//     setSortOption(event.target.value);
//   };

//   const handleSortButtonClick = () => {
//     const sortedCourses = [...courses].sort((a, b) => {
//       if (sortOption === "title-asc") {
//         return a.title.localeCompare(b.title);
//       } else if (sortOption === "title-desc") {
//         return b.title.localeCompare(a.title);
//       }
//       return 0;
//     });

//     setCourses(sortedCourses);
//   };

//   // Use the number of skeletons based on expected data length or fallback to 4
//   const skeletonCount = loading
//     ? (courses && courses.length > 0 ? courses.length : 6)
//     : 0;

//   return (
//     <div className="courses-page">
//       <h2>Courses Page</h2>

//       {/* Sorting options */}
//       <div className="courses-page-sort-by">
//         <span>Sort by:</span>
//         <select value={sortOption} onChange={handleSortChange}>
//           <option value="">Select an option</option>
//           <option value="title-asc">Title: A to Z</option>
//           <option value="title-desc">Title: Z to A</option>
//         </select>
//         <button onClick={handleSortButtonClick}>Sort</button>
//       </div>

//       {/* Courses section */}
//       <section className="courses-page-section">
//         <div className="courses-page-container-cards">
//           {loading ? (
//             Array.from({ length: skeletonCount }).map((_, i) => (
//               <CourseCardSkeleton key={i} />
//             ))
//           ) : courses.length > 0 ? (
//             courses.map((course) => (
//               <Link
//                 to={`/course-details/${course._id}`}
//                 key={course._id}
//                 className="general-courses-card-link"
//               >
//                 <div className="courses-page-card">
//                   <img
//                     src={course.imageurl}
//                     alt={course.title}
//                     className="courses-page-image"
//                   />
//                   <h3>{course.title}</h3>
//                   <p>
//                     <strong>Instructor:</strong>{" "}
//                     {course.trainer?.fullName || "Unknown"}
//                   </p>
//                   <p>
//                     <strong>Enrolled Learners:</strong>{" "}
//                     {course.learners?.length || 0}
//                   </p>
//                   <span className="btn-primary">Read More</span>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <p>No courses available</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CoursesPage;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";

// Skeleton loader for course cards
const LearnerCoursesSkeleton = ({ count = 6 }) => (
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

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  const learnerToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://hilms.onrender.com/api/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data.data || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch("https://hilms.onrender.com/api/learner/enrolled-courses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${learnerToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch enrolled courses");
        const data = await response.json();
        const enrolledIds = new Set(data.data.map((course) => course._id));
        setEnrolledCourses(enrolledIds);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (learnerToken) fetchEnrolledCourses();
  }, [learnerToken]);

  const handleSortChange = (event) => setSortOption(event.target.value);

  const handleSortButtonClick = () => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
    setCourses(sortedCourses);
  };

  return (
    <div className="courses-page">
      <h2>Courses Page</h2>
      <div className="courses-page-sort-by">
        <span>Sort by:</span>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="">Select an option</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
        <button onClick={handleSortButtonClick}>Sort</button>
      </div>

   <section className="courses-section">
    {loading ? (
      <LearnerCoursesSkeleton count={courses.length > 0 ? courses.length : 6} />
    ) : (
      <div className="courses-container-cards">
        {courses.length > 0 ? (
          courses.map((course) => (
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
                <h3>{course.title}</h3>
                <p>
                  <strong>Instructor:</strong> {course.trainer?.fullName || "Unknown"}
                </p>
                <p>
                  <strong>Enrolled Learners:</strong> {course.learners?.length || 0}
                </p>
                {enrolledCourses?.has(course._id) && (
                  <p className="enrolled-label">✔ Enrolled</p>
                )}
                <span className={enrolledCourses?.has(course._id) ? "btn-continue" : "btn-read-more"}>
                  {enrolledCourses?.has(course._id) ? "Continue Course" : "Read More"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    )}
  </section>
    </div>
  );
};

export default CoursesPage;