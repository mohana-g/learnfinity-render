// controllers/LearnerController.js
const pool = require('../config/db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Learner = require('../models/Learner');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require("../models/User");
const Course = require("../models/Course");

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
// Handle Learner signup (Postgres version)
const learnerSignUp = async (req, res) => {
  const { firstName, lastName, dob, email, phone, password, address } = req.body;

  // Validate input
  if (!firstName || !lastName || !dob || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if Learner already exists
    const { rows: existingLearners } = await pool.query(
      "SELECT * FROM learner WHERE email=$1 OR phone=$2",
      [email, phone]
    );
    if (existingLearners.length > 0) {
      return res
        .status(400)
        .json({ error: "Learner with this email or phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Insert into learner table
    // const { rows: newLearnerRows } = await pool.query(
    //   `INSERT INTO learner 
    //     (first_name, last_name, dob, email, phone, password, address, courses, quizzes, completed_lessons, created_at, updated_at)
    //    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
    //    RETURNING *`,
    //   [
    //     firstName,
    //     lastName,
    //     dob,
    //     email,
    //     phone,
    //     hashedPassword,
    //     address || "",
    //     JSON.stringify([]), // courses empty array
    //     JSON.stringify([]), // quizzes empty array
    //     JSON.stringify([]), // completedLessons empty array
    //   ]
    // );

    // Insert into learner table
    const { rows: newLearnerRows } = await pool.query(
      `INSERT INTO learner 
        (first_name, last_name, dob, email, phone, password, address, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING *`,
      [firstName, lastName, dob, email, phone, hashedPassword, address || ""]
    );

    const learner = newLearnerRows[0];

    // Insert into users table (linked with learner_id)
    await pool.query(
      `INSERT INTO users (email, password, role, learner_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [email, hashedPassword, 0, learner.id] // role 0 = Learner
    );

    // Generate JWT
    const token = jwt.sign({ id: learner.id, role: "learner" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      success: true,
      token,
      message: "Learner registered successfully!",
    });
  } catch (err) {
    console.error("Error during learner signup:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get enrolled courses for a Learner
const getEnrolledCourses = async (req, res) => {
  try {
    const learnerId = req.user?.id; // ensure req.user exists

    if (!learnerId) {
      return res.status(400).json({ success: false, message: "Learner ID missing or invalid" });
    }

    const query = `
      SELECT 
          c.id, 
          c.title, 
          c.description, 
          c.imageurl, 
          t.full_name AS "trainerFullName",
          COUNT(lc2.learner_id) AS "enrolledCount"
      FROM courses c
      JOIN learner_courses lc ON lc.course_id = c.id
      JOIN trainer t ON c.trainer_id = t.id
      LEFT JOIN learner_courses lc2 ON lc2.course_id = c.id
      WHERE lc.learner_id = $1
      GROUP BY c.id, t.full_name
    `;

    const { rows } = await pool.query(query, [learnerId]);

    res.status(200).json({
      success: true,
      data: rows,
    });

  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enrolled courses",
      error: error.message,
    });
  }
};


// Update Learner profile
const getLoggedInLearnerProgress = async (req, res) => {
  try {
    const learnerId = req.user.id;

    // 1. Fetch learner details with courses, chapters, lessons, and quizzes
    const { rows: courses } = await pool.query(`
      SELECT c.id AS course_id, c.title,
            json_agg(
              json_build_object(
                'chapter_id', ch.id,
                'name', ch.name,
                'lessons', (
                  SELECT json_agg(json_build_object('lesson_id', l.id, 'title', l.title))
                  FROM lessons l WHERE l.chapter_id = ch.id
                )
              )
            ) AS chapters,
            (SELECT json_agg(json_build_object('quiz_id', q.id, 'course_id', q.course_id, 'title', q.title))
              FROM quizzes q WHERE q.course_id = c.id) AS quizzes
      FROM courses c
      JOIN learner_courses lc ON lc.course_id = c.id
      LEFT JOIN chapters ch ON ch.course_id = c.id
      WHERE lc.learner_id = $1
      GROUP BY c.id
    `, [learnerId]);


    if (courses.length === 0) {
      return res.status(404).json({ error: "Learner not found or no enrolled courses" });
    }

    // 2. Get learner completed lessons
    const { rows: completedLessonsRows } = await pool.query(
  `SELECT l.id AS lesson_id 
   FROM learner_completed_lessons lcl
   JOIN lessons l ON lcl.lesson_id = l.id
   WHERE lcl.learner_id = $1`,
  [learnerId]
);
    const completedLessonIds = completedLessonsRows.map(r => r.lesson_id);

    // 3. Get learner completed quizzes
    const { rows: completedQuizzesRows } = await pool.query(
  `SELECT quiz_id, course_id 
   FROM learner_quizzes 
   WHERE learner_id = $1`,
  [learnerId]
);
    const completedQuizIds = completedQuizzesRows.map(r => r.quiz_id);
    const completedQuizCourseMap = new Map(
      completedQuizzesRows.map(q => [q.quiz_id, q.course_id])
    );

    // 4. Calculate progress
    const enrolledCourses = courses.map(course => {
      // total lessons
      const totalLessons = course.chapters?.reduce((count, ch) => {
        return count + (ch.lessons?.length || 0);
      }, 0) || 0;

      // flatten all lesson IDs of course
      const courseLessonIds = course.chapters?.flatMap(ch =>
        ch.lessons ? ch.lessons.map(l => l.lesson_id) : []
      ) || [];

      // completed lessons count (intersection)
      const completedLessonsCount = completedLessonIds.filter(id =>
        courseLessonIds.includes(id)
      ).length;

      // completed quizzes count (match by course_id)
      const completedQuizzesCount = (course.quizzes || []).filter(q =>
        completedQuizIds.includes(q.quiz_id) &&
        completedQuizCourseMap.get(q.quiz_id) === course.course_id
      ).length;

      const totalQuizzes = course.quizzes ? course.quizzes.length : 0;
      const totalItems = totalLessons + totalQuizzes;
      const completedItems = completedLessonsCount + completedQuizzesCount;

      const progressPercent = totalItems > 0 ? ((completedItems / totalItems) * 100).toFixed(0) : 0;

      return {
        courseTitle: course.title,
        totalChapters: course.chapters ? course.chapters.length : 0,
        totalLessons,
        completedLessons: completedLessonsCount,
        totalQuizzes,
        completedQuizzes: completedQuizzesCount,
        progressPercent
      };
    });

    res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("Error fetching learner progress:", error);
    res.status(500).json({ error: "Error fetching Learner progress" });
  }
};


module.exports = { learnerSignUp, getEnrolledCourses, getLoggedInLearnerProgress };
