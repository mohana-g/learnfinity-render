import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCareerPath.css";

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
  const [careerPaths, setCareerPaths] = useState([]);
  const [editId, setEditId] = useState(null);

    // ✅ Toast state
  const [toast, setToast] = useState(null);

  // // ✅ new: state for messages
  // const [message, setMessage] = useState({ type: "", text: "" });

  // fetch courses
  useEffect(() => {
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
      });
  }, []);

  // fetch existing career paths
  const fetchCareerPaths = () => {
    axios
      .get("https://hilms.onrender.com/api/career-paths")
      .then((res) => setCareerPaths(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching career paths:", err);
        setCareerPaths([]);
      });
  };

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  // utility: show message
  // const showMessage = (type, text) => {
  //   setMessage({ type, text });
  //   setTimeout(() => setMessage({ type: "", text: "" }), 3000); // auto-hide
  // };

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

    if (editId) {
      axios
        .put(`https://hilms.onrender.com/api/career-paths/${editId}`, careerPath)
        .then(() => {
          setEditId(null);
          resetForm();
          fetchCareerPaths();
          showMessage("success", "Career path updated successfully!");
        })
        .catch(() => showMessage("error", "Failed to update career path."));
    } else {
      axios
        .post("https://hilms.onrender.com/api/career-paths", careerPath)
        .then(() => {
          resetForm();
          fetchCareerPaths();
          showMessage("success", "Career path added successfully!");
        })
        .catch(() => showMessage("error", "Failed to add career path."));
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
      <h2>{editId ? "Edit Career Path" : "Add Career Path"}</h2>

      {/* ✅ Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.text}
          onClose={() => setToast(null)}
        />
      )}

      {/* ✅ success/error message
      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )} */}

      {/* Form Section */}
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
            <button type="button" onClick={() => removeRole(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addRole}>Add Role</button>

        <h4>Courses</h4>
        {careerPath.courses.map((course, cIndex) => (
          <div key={cIndex} className="selected-course">
            <select
              value={course.courseId}
              onChange={(e) => handleCourseChange(cIndex, "courseId", e.target.value)}
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
              onChange={(e) => handleCourseChange(cIndex, "duration", e.target.value)}
            />

            <h5>Skills Learnt</h5>
            {course.skillsLearnt.map((skill, sIndex) => (
              <div key={sIndex}>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(cIndex, sIndex, e.target.value)}
                />
                <button type="button" onClick={() => removeSkill(cIndex, sIndex)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addSkill(cIndex)}>Add Skill</button>
            <button type="button" onClick={() => removeCourse(cIndex)}>Remove Course</button>
          </div>
        ))}
        <button type="button" onClick={addCourse}>Add Course</button>

        <br />
        <button type="submit">{editId ? "Update" : "Submit"}</button>
      </form>

      {/* Existing Career Paths Section */}
      <div className="existing-careerpaths">
        <h3>Existing Career Paths</h3>
        {careerPaths.length === 0 ? (
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
