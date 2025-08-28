import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCareerPath.css";

// Skeleton for career path list item
const CareerPathSkeleton = () => {
  return (
    <li className="careerpath-skeleton">
      <div className="skeleton skeleton-title-list"></div>
      <div className="skeleton skeleton-btn-list"></div>
      <div className="skeleton skeleton-btn-list"></div>
    </li>
  );
};

const CareerPathFormSkeleton = () => {
  return (
    <div className="careerpath-form-skeleton">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-textarea"></div>

      <div className="skeleton skeleton-subtitle"></div>
      <div className="skeleton skeleton-input"></div>
      <div className="skeleton skeleton-btn"></div>

      <div className="skeleton skeleton-subtitle"></div>
      <div className="skeleton skeleton-select"></div>
      <div className="skeleton skeleton-input"></div>
      <div className="skeleton skeleton-input"></div>
      <div className="skeleton skeleton-btn"></div>

      <div className="skeleton skeleton-submit"></div>
    </div>
  );
};

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

const AddCareerPath = () => {
  const [careerPath, setCareerPath] = useState({
    title: "",
    description: "",
    roles: [""],
    courses: [
      {
        courseId: "",
        level: "",
        duration: "",
        skillsLearnt: [""],
      },
    ],
  });

  const [courses, setCourses] = useState([]);
  const [careerPaths, setCareerPaths] = useState(null); // null = loading, [] = empty
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

    // ✅ Toast state
  const [toast, setToast] = useState(null);

  // fetch courses
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://hilms.onrender.com/api/courses")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setCourses([]);
      })
      .finally(() => setLoading(false));   // ✅ turn loading off
  }, []);


  // fetch existing career paths
  const fetchCareerPaths = () => {
    axios
      .get("https://hilms.onrender.com/api/career-paths")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setCareerPaths(res.data.data); // ✅ use nested "data"
        } else {
          setCareerPaths([]); // keep proper empty state
        }
      })
      .catch((err) => {
        console.error("Error fetching career paths:", err);
        setCareerPaths([]); // safe fallback
      });
  };


  useEffect(() => {
    fetchCareerPaths();
  }, []);

    // utility: show toast
  const showMessage = (type, text) => {
    setToast({ type, text });
  };

  // general input
  const handleChange = (e) => {
    setCareerPath({ ...careerPath, [e.target.name]: e.target.value });
  };

  // roles
  const handleRoleChange = (index, value) => {
    const updatedRoles = [...careerPath.roles];
    updatedRoles[index] = value;
    setCareerPath({ ...careerPath, roles: updatedRoles });
  };

  const addRole = () => {
    setCareerPath({ ...careerPath, roles: [...careerPath.roles, ""] });
  };

  const removeRole = (index) => {
    const updatedRoles = careerPath.roles.filter((_, i) => i !== index);
    setCareerPath({ ...careerPath, roles: updatedRoles });
  };

  // courses
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...careerPath.courses];
    updatedCourses[index][field] = value;
    setCareerPath({ ...careerPath, courses: updatedCourses });
  };

  const addCourse = () => {
    setCareerPath({
      ...careerPath,
      courses: [
        ...careerPath.courses,
        { courseId: "", level: "", duration: "", skillsLearnt: [""] },
      ],
    });
  };

  const removeCourse = (index) => {
    const updatedCourses = careerPath.courses.filter((_, i) => i !== index);
    setCareerPath({ ...careerPath, courses: updatedCourses });
  };

  // skills inside course
  const handleSkillChange = (cIndex, sIndex, value) => {
    const updatedCourses = [...careerPath.courses];
    updatedCourses[cIndex].skillsLearnt[sIndex] = value;
    setCareerPath({ ...careerPath, courses: updatedCourses });
  };

  const addSkill = (cIndex) => {
    const updatedCourses = [...careerPath.courses];
    updatedCourses[cIndex].skillsLearnt.push("");
    setCareerPath({ ...careerPath, courses: updatedCourses });
  };

  const removeSkill = (cIndex, sIndex) => {
    const updatedCourses = [...careerPath.courses];
    updatedCourses[cIndex].skillsLearnt = updatedCourses[cIndex].skillsLearnt.filter(
      (_, i) => i !== sIndex
    );
    setCareerPath({ ...careerPath, courses: updatedCourses });
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (editId) {
      axios
        .put(`https://hilms.onrender.com/api/career-paths/${editId}`, careerPath)
        .then(() => {
          setEditId(null);
          resetForm();
          fetchCareerPaths();
          showMessage("success", "Career path updated successfully!");
        })
        .catch(() => showMessage("error", "Failed to update career path."))
        .finally(() => setLoading(false));
    } else {
      axios
        .post("https://hilms.onrender.com/api/career-paths", careerPath)
        .then(() => {
          resetForm();
          fetchCareerPaths();
          showMessage("success", "Career path added successfully!");
        })
        .catch(() => showMessage("error", "Failed to add career path."))
        .finally(() => setLoading(false));
    }
  };


  // reset form
  const resetForm = () => {
    setCareerPath({
      title: "",
      description: "",
      roles: [""],
      courses: [{ courseId: "", level: "", duration: "", skillsLearnt: [""] }],
    });
  };

  // edit mode
  const handleEdit = (path) => {
    setCareerPath({
      title: path.title || "",
      description: path.description || "",
      roles: Array.isArray(path.roles) && path.roles.length ? path.roles : [""],
      courses:
        Array.isArray(path.courses) && path.courses.length
          ? path.courses
          : [{ courseId: "", level: "", duration: "", skillsLearnt: [""] }],
    });
    setEditId(path._id);
  };

  // delete
  const handleDelete = (id) => {
    axios
      .delete(`https://hilms.onrender.com/api/career-paths/${id}`)
      .then(() => {
        fetchCareerPaths();
        showMessage("success", "Career path deleted successfully!");
      })
      .catch(() => showMessage("error", "Failed to delete career path."));
  };
return (
  <div className="add-careerpath-page">

    {/* ✅ Toast */}
    {toast && (
      <Toast
        type={toast.type}
        message={toast.text}
        onClose={() => setToast(null)}
      />
    )}

    {/* Add Career Path Section */}
    {loading ? (
      <CareerPathFormSkeleton />
    ) : (
    <div className="careerpath-form-container">
      <h2>{editId ? "Edit Career Path" : "Add Career Path"}</h2>
      <form onSubmit={handleSubmit} className="careerpath-form">
        <input
          type="text"
          name="title"
          placeholder="Career Path Title"
          value={careerPath.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={careerPath.description}
          onChange={handleChange}
          required
        />

        <h4>Roles</h4>
        {careerPath.roles.map((role, index) => (
          <div key={index}>
            <input
              type="text"
              value={role}
              onChange={(e) => handleRoleChange(index, e.target.value)}
            />
            <button type="button" onClick={() => removeRole(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addRole}>
          Add Role
        </button>

        <h4>Courses</h4>
        {careerPath.courses.map((course, cIndex) => (
          <div key={cIndex} className="selected-course">
            <select
              value={course.courseId}
              onChange={(e) =>
                handleCourseChange(cIndex, "courseId", e.target.value)
              }
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title || c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Level"
              value={course.level}
              onChange={(e) => handleCourseChange(cIndex, "level", e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration"
              value={course.duration}
              onChange={(e) =>
                handleCourseChange(cIndex, "duration", e.target.value)
              }
            />

            <h5>Skills Learnt</h5>
            {course.skillsLearnt.map((skill, sIndex) => (
              <div key={sIndex}>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleSkillChange(cIndex, sIndex, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeSkill(cIndex, sIndex)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addSkill(cIndex)}>
              Add Skill
            </button>
            <button type="button" onClick={() => removeCourse(cIndex)}>
              Remove Course
            </button>
          </div>
        ))}
        <button type="button" onClick={addCourse}>
          Add Course
        </button>

        <br />
        <button type="submit">{editId ? "Update" : "Submit"}</button>
      </form>
    </div>
    )}

    {/* Existing Career Paths Section */}
    <div className="careerpath-list-container">
      <h3>Existing Career Paths</h3>
      {careerPaths === null ? (
        <ul>
          {/* Show 3 skeletons while loading */}
          {[...Array(3)].map((_, i) => (
            <CareerPathSkeleton key={i} />
          ))}
        </ul>
      ) : careerPaths.length === 0 ? (
        <p>No career paths found.</p>
      ) : (
        <ul>
          {careerPaths.map((path) => (
            <li key={path._id}>
              <strong>{path.title}</strong>
              <button onClick={() => handleEdit(path)}>Edit</button>
              <button onClick={() => handleDelete(path._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>

  </div>
);

};

export default AddCareerPath;
