import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCareerPath = () => {
  const [careerPathData, setCareerPathData] = useState({
    title: "",
    roles: "",
    description: "",
    courses: [], // ✅ always an array
  });

  const [allCourses, setAllCourses] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all available courses
  useEffect(() => {
    axios.get("/api/courses").then((res) => setAllCourses(res.data));
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    const res = await axios.get("/api/careerpaths");
    setCareerPaths(res.data);
  };

  const handleInputChange = (e) => {
    setCareerPathData({ ...careerPathData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...careerPathData.courses];
    updatedCourses[index][field] = value;
    setCareerPathData({ ...careerPathData, courses: updatedCourses });
  };

  const addCourseField = () => {
    setCareerPathData({
      ...careerPathData,
      courses: [
        ...careerPathData.courses,
        { courseId: "", level: "", duration: "", skills: "" },
      ],
    });
  };

  const removeCourseField = (index) => {
    const updatedCourses = careerPathData.courses.filter((_, i) => i !== index);
    setCareerPathData({ ...careerPathData, courses: updatedCourses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/careerpaths/${editingId}`, careerPathData);
    } else {
      await axios.post("/api/careerpaths", careerPathData);
    }
    setCareerPathData({ title: "", roles: "", description: "", courses: [] });
    setEditingId(null);
    fetchCareerPaths();
  };

  const handleEdit = (path) => {
    setCareerPathData({
      title: path.title,
      roles: path.roles,
      description: path.description,
      courses: Array.isArray(path.courses) ? path.courses : [], // ✅ safe
    });
    setEditingId(path._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/careerpaths/${id}`);
    fetchCareerPaths();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingId ? "Update Career Path" : "Add Career Path"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Career Path Title (e.g. Developer, Designer)"
          value={careerPathData.title}
          onChange={handleInputChange}
          required
        />
        <br />

        <input
          type="text"
          name="roles"
          placeholder="Roles (comma separated, e.g. Software Engineer, Analyst)"
          value={careerPathData.roles}
          onChange={handleInputChange}
          required
        />
        <br />

        <textarea
          name="description"
          placeholder="Description about the Career Path"
          value={careerPathData.description}
          onChange={handleInputChange}
          required
        />
        <br />

        <h3>Courses</h3>
        {Array.isArray(careerPathData.courses) &&
          careerPathData.courses.map((course, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <select
                value={course.courseId}
                onChange={(e) =>
                  handleCourseChange(index, "courseId", e.target.value)
                }
                required
              >
                <option value="">Select Course</option>
                {allCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Level (Beginner, Intermediate, Advanced)"
                value={course.level}
                onChange={(e) =>
                  handleCourseChange(index, "level", e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Duration (e.g. 3 weeks)"
                value={course.duration}
                onChange={(e) =>
                  handleCourseChange(index, "duration", e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={course.skills}
                onChange={(e) =>
                  handleCourseChange(index, "skills", e.target.value)
                }
                required
              />

              <button type="button" onClick={() => removeCourseField(index)}>
                Remove
              </button>
            </div>
          ))}

        <button type="button" onClick={addCourseField}>
          + Add Course
        </button>
        <br />
        <button type="submit">{editingId ? "Update" : "Submit"}</button>
      </form>

      <h2>Existing Career Paths</h2>
      <ul>
        {careerPaths.map((path) => (
          <li key={path._id}>
            <strong>{path.title}</strong> – {path.roles}
            <button onClick={() => handleEdit(path)}>Edit</button>
            <button onClick={() => handleDelete(path._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCareerPath;
