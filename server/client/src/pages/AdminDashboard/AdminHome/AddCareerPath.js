import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCareerPath.css";

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

  const [courses, setCourses] = useState([]); // available courses from DB
  const [careerPaths, setCareerPaths] = useState([]); // all saved career paths
  const [editId, setEditId] = useState(null);

  // fetch courses
  useEffect(() => {
    axios
      .get("https://hilms.onrender.com/api/courses")
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching courses:", err));
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
        })
        .catch((err) => console.error("Error updating career path:", err));
    } else {
      axios
        .post("https://hilms.onrender.com/api/career-paths", careerPath)
        .then(() => {
          resetForm();
          fetchCareerPaths();
        })
        .catch((err) => console.error("Error adding career path:", err));
    }
  };

  // reset form
  const resetForm = () => {
    setCareerPath({
      title: "",
      description: "",
      roles: [""],
      courses: [
        { courseId: "", level: "", duration: "", skillsLearnt: [""] },
      ],
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
      .then(() => fetchCareerPaths())
      .catch((err) => console.error("Error deleting career path:", err));
  };
return (
  <div className="add-careerpath-page">
    <h2>{editId ? "Edit Career Path" : "Add Career Path"}</h2>

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
          <button type="button" onClick={() => removeRole(index)}>
            Remove
          </button>
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
              <option key={c._id} value={c._id}>{c.title}</option>
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
              <strong>{path.title}</strong> - {path.description}
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
