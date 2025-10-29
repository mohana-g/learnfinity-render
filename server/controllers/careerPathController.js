// // controllers/careerPathController.js
// const CareerPath = require("../models/CareerPath");
// const Learner = require("../models/Learner");
// const Course = require("../models/Course");
// const Trainer = require("../models/Trainer");
// const Chapter = require("../models/Chapter");
// const Quiz = require("../models/Quiz");
// const Lesson = require("../models/Lesson");
// const mongoose = require("mongoose");

// exports.getCareerPaths = async (req, res) => {
//   try {
//     const paths = await CareerPath.find().populate({
//       path: "levels.courses",
//       select: "title imageurl name"
//     });
//     res.status(200).json({ data: paths });
//   } catch (err) {
//     console.error("CareerPath fetch error:", err);
//     res.status(500).json({ message: "Error fetching career paths", error: err.message });
//   }
// };

// exports.getCareerPathById = async (req, res) => {
//   try {
//     const path = await CareerPath.findById(req.params.id).populate({
//       path: "levels.courses",
//       select: "title description imageurl name"
//     });

//     if (!path) {
//       return res.status(404).json({ message: "Career path not found" });
//     }
//     res.status(200).json({ data: path });
//   } catch (err) {
//     console.error("CareerPath by ID error:", err);
//     res.status(500).json({ message: "Error fetching career path details", error: err.message });
//   }
// };



//correct old code
// const CareerPath = require("../models/CareerPath");

// // GET all career paths
// exports.getCareerPaths = async (req, res) => {
//   try {
//     const paths = await CareerPath.find().populate("courses.courseId", "title");
//     res.json(paths);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // POST create new career path
// exports.createCareerPath = async (req, res) => {
//   try {
//     const newPath = new CareerPath(req.body);
//     const saved = await newPath.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data", details: err.message });
//   }
// };

// // PUT update career path
// exports.updateCareerPath = async (req, res) => {
//   try {
//     const updated = await CareerPath.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updated) return res.status(404).json({ error: "CareerPath not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data", details: err.message });
//   }
// };

// // DELETE career path
// exports.deleteCareerPath = async (req, res) => {
//   try {
//     const deleted = await CareerPath.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "CareerPath not found" });
//     res.json({ message: "CareerPath deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

const pool = require("../config/db");

const CareerPath = require("../models/CareerPath");

// ✅ GET all career paths
exports.getCareerPaths = async (req, res) => {
  try {
    // Fetch all career paths
    const pathRes = await pool.query(`SELECT * FROM career_paths ORDER BY id`);
    const paths = pathRes.rows;

    // Fetch related roles and courses for each path
    const formattedPaths = await Promise.all(
      paths.map(async (path) => {
        // Roles
        const rolesRes = await pool.query(
          `SELECT role FROM career_path_roles WHERE career_path_id = $1`,
          [path.id]
        );
        const roles = rolesRes.rows.map((r) => r.role);

        // Courses with trainer + skills
        const coursesRes = await pool.query(
          `SELECT 
             cpc.id AS career_path_course_id,
             cpc.course_id,
             cpc.level,
             cpc.duration,
             c.id AS course_id,
             c.title AS course_title,
             c.description AS course_description,
             c.imageurl AS course_imageurl,
             t.id AS trainer_id,
             t.full_name AS trainer_name,
             t.institute AS trainer_institute,
             t.email AS trainer_email,
             t.phone_number AS trainer_phone,
             COALESCE(json_agg(cpcs.skill) FILTER (WHERE cpcs.skill IS NOT NULL), '[]') AS skills
           FROM career_path_courses cpc
           LEFT JOIN courses c ON c.id = cpc.course_id
           LEFT JOIN trainer t ON t.id = c.trainer_id
           LEFT JOIN career_path_course_skills cpcs ON cpcs.career_path_course_id = cpc.id
           WHERE cpc.career_path_id = $1
           GROUP BY cpc.id, c.id, t.id`,
          [path.id]
        );

        const courses = coursesRes.rows.map((c) => ({
          career_path_course_id: c.career_path_course_id,
          courseId: {
            id: c.course_id,
            title: c.course_title,
            description: c.course_description,
            imageurl: c.course_imageurl,
            trainer: c.trainer_id
              ? {
                  id: c.trainer_id,
                  full_name: c.trainer_name,
                  institute: c.trainer_institute,
                  email: c.trainer_email,
                  phone_number: c.trainer_phone,
                }
              : null,
          },
          level: c.level,
          duration: c.duration,
          skillsLearnt: c.skills,
        }));

        // Generate summary
        const levels = courses.map((c) => c.level).filter(Boolean);
        const uniqueLevels = [...new Set(levels)];
        const levelOrder = ["Beginner", "Intermediate", "Advanced"];
        const sortedLevels = uniqueLevels.sort(
          (a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)
        );
        let levelSummary = "";
        if (sortedLevels.length === 1) levelSummary = sortedLevels[0];
        else if (sortedLevels.length > 1)
          levelSummary = `${sortedLevels[0]} to ${sortedLevels[sortedLevels.length - 1]}`;

        return {
          ...path,
          roles,
          courses,
          levelSummary,
        };
      })
    );

    res.json({ success: true, data: formattedPaths });
  } catch (err) {
    console.error("Error fetching career paths:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET single career path by ID
exports.getCareerPathById = async (req, res) => {
  try {
    const { id } = req.params;
    const pathId = parseInt(id, 10);

    if (isNaN(pathId)) {
      return res.status(400).json({ error: "Invalid CareerPath ID" });
    }

    // Get main path
    const pathRes = await pool.query(
      `SELECT id, title, description, created_at, updated_at
       FROM career_paths
       WHERE id = $1`,
      [pathId]
    );

    if (pathRes.rows.length === 0) {
      return res.status(404).json({ error: "CareerPath not found" });
    }

    const path = pathRes.rows[0];

    // Get roles
    const rolesRes = await pool.query(
      `SELECT role
       FROM career_path_roles
       WHERE career_path_id = $1`,
      [pathId]
    );
    const roles = rolesRes.rows.map((r) => r.role);

    // Get courses and skills
    const coursesRes = await pool.query(
      `SELECT cpc.id AS career_path_course_id,
              cpc.course_id,
              cpc.level,
              cpc.duration,
              json_agg(cpcs.skill) FILTER (WHERE cpcs.skill IS NOT NULL) AS skills
       FROM career_path_courses cpc
       LEFT JOIN career_path_course_skills cpcs
         ON cpcs.career_path_course_id = cpc.id
       WHERE cpc.career_path_id = $1
       GROUP BY cpc.id`,
      [pathId]
    );

    // Populate course + trainer info
    const courses = await Promise.all(
      coursesRes.rows.map(async (c) => {
        const courseRes = await pool.query(
          `SELECT id, title, name, description, imageurl, instructor_name, trainer_id
           FROM courses
           WHERE id = $1`,
          [c.course_id]
        );
        const course = courseRes.rows[0];

        // 🔹 Fetch chapters and lessons for this course
        const chaptersRes = await pool.query(
          `SELECT ch.id, ch.name
          FROM chapters ch
          WHERE ch.course_id = $1
          ORDER BY ch.id ASC`,
          [course.id]
        );

        const chapters = await Promise.all(
          chaptersRes.rows.map(async (ch) => {
            const lessonsRes = await pool.query(
              `SELECT l.id, l.title
              FROM lessons l
              WHERE l.chapter_id = $1
              ORDER BY l.id ASC`,
              [ch.id]
            );
            return {
              id: ch.id,
              name: ch.name,
              lessons: lessonsRes.rows
            };
          })
        );

        let trainer = null;
        if (course.trainer_id) {
          const trainerRes = await pool.query(
            `SELECT id, full_name, institute, phone_number, email, gender
             FROM trainer
             WHERE id = $1`,
            [course.trainer_id]
          );
          trainer = trainerRes.rows[0] || null;
        }

        return {
          career_path_course_id: c.career_path_course_id,
          level: c.level,
          duration: c.duration,
          skillsLearnt: c.skills || [],
          courseId: {
            id: course.id,
            title: course.title,
            name: course.name,
            description: course.description,
            imageurl: course.imageurl,
            instructor_name: course.instructor_name,
            trainer,
            chapters,
          },
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...path,
        roles,
        courses,
      },
    });
  } catch (err) {
    console.error("Error fetching career path:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ CREATE career path
exports.createCareerPath = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, roles, courses } = req.body;

    await client.query("BEGIN");

    // Insert main path
    const pathRes = await client.query(
      `INSERT INTO career_paths (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    const careerPathId = pathRes.rows[0].id;

    // Insert roles
    if (roles?.length) {
      for (const role of roles) {
        await client.query(
          `INSERT INTO career_path_roles (career_path_id, role) VALUES ($1, $2)`,
          [careerPathId, role]
        );
      }
    }

    // Insert courses + skills
    if (courses?.length) {
      for (const course of courses) {
        const { courseId, level, duration, skillsLearnt } = course; // use skillsLearnt
        const courseRes = await client.query(
          `INSERT INTO career_path_courses (career_path_id, course_id, level, duration)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [careerPathId, courseId, level || null, duration || null]
        );
        const careerPathCourseId = courseRes.rows[0].id;

        if (skillsLearnt?.length) {
          for (const skill of skillsLearnt.filter((s) => s.trim() !== "")) {
            await client.query(
              `INSERT INTO career_path_course_skills (career_path_course_id, skill)
               VALUES ($1, $2)`,
              [careerPathCourseId, skill]
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Career path created successfully!",
      data: pathRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating career path:", err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ✅ UPDATE career path
exports.updateCareerPath = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { title, description, roles, courses } = req.body;

    await client.query("BEGIN");

    const pathRes = await client.query(
      `UPDATE career_paths 
       SET title = $1, description = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [title, description, id]
    );
    if (pathRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "CareerPath not found" });
    }

    // Replace roles
    await client.query(`DELETE FROM career_path_roles WHERE career_path_id = $1`, [id]);
    if (roles?.length) {
      for (const role of roles) {
        await client.query(
          `INSERT INTO career_path_roles (career_path_id, role) VALUES ($1, $2)`,
          [id, role]
        );
      }
    }

    // Replace courses and skills
    const oldCourses = await client.query(
      `SELECT id FROM career_path_courses WHERE career_path_id = $1`,
      [id]
    );
    for (const c of oldCourses.rows) {
      await client.query(`DELETE FROM career_path_course_skills WHERE career_path_course_id = $1`, [c.id]);
    }
    await client.query(`DELETE FROM career_path_courses WHERE career_path_id = $1`, [id]);

    if (courses?.length) {
      for (const course of courses) {
        const { courseId, level, duration, skillsLearnt  } = course;
        const courseRes = await client.query(
          `INSERT INTO career_path_courses (career_path_id, course_id, level, duration)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [id, courseId, level || null, duration || null]
        );
        const careerPathCourseId = courseRes.rows[0].id;

        if (skillsLearnt ?.length) {
          for (const skill of skillsLearnt ) {
            await client.query(
              `INSERT INTO career_path_course_skills (career_path_course_id, skill)
               VALUES ($1, $2)`,
              [careerPathCourseId, skill]
            );
          }
        }
      }
    }

    await client.query("COMMIT");

    res.json({ success: true, data: pathRes.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating career path:", err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ✅ DELETE career path
exports.deleteCareerPath = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRes = await pool.query(
      `DELETE FROM career_paths WHERE id = $1 RETURNING *`,
      [id]
    );
    if (deleteRes.rows.length === 0)
      return res.status(404).json({ error: "CareerPath not found" });

    res.json({ success: true, message: "CareerPath deleted successfully!" });
  } catch (err) {
    console.error("Error deleting career path:", err);
    res.status(500).json({ error: "Server error" });
  }
};
