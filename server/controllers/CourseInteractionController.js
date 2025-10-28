const pool = require("../config/db");

const mongoose = require('mongoose');
const Course = require('../models/Course');
const Learner = require('../models/Learner');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Chapter = require('../models/Chapter');
const Review = require('../models/Review');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

//Get course contents
const getEnrolledCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 1) fetch course + trainer
    const courseRes = await pool.query(
      `SELECT c.id, c.title, c.name, c.description, c.imageurl, c.instructor_name,
              t.id AS trainer_id, t.full_name AS trainer_full_name,
              (SELECT COUNT(*) FROM learner_courses lc WHERE lc.course_id = c.id) AS enrolled_count
       FROM courses c
       LEFT JOIN trainer t ON c.trainer_id = t.id
       WHERE c.id = $1`,
      [courseId]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = courseRes.rows[0];

    // 2) fetch chapters and lessons for the course (chapters array with lessons)
    const chaptersRes = await pool.query(
      `SELECT ch.id AS chapter_id, ch.name AS chapter_name,
              COALESCE(json_agg(json_build_object('lesson_id', l.id, 'number', l.number, 'title', l.title, 'description', l.description, 'videoUrl', l.video_url) ORDER BY l.id) FILTER (WHERE l.id IS NOT NULL), '[]') AS lessons
       FROM chapters ch
       LEFT JOIN lessons l ON l.chapter_id = ch.id
       WHERE ch.course_id = $1
       GROUP BY ch.id
       ORDER BY ch.id`,
      [courseId]
    );

    const chapters = chaptersRes.rows.map((r) => ({
      _id: r.chapter_id,
      name: r.chapter_name,
      lessons: r.lessons,
    }));

    // 3) verify learner exists
    const learnerRes = await pool.query("SELECT id FROM learner WHERE id = $1", [userId]);
    if (learnerRes.rows.length === 0) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // 4) verify enrollment via learner_courses junction
    const enrolledRes = await pool.query(
      `SELECT 1 FROM learner_courses WHERE learner_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    if (enrolledRes.rows.length === 0) {
      return res.status(403).json({ message: "Access denied. Not enrolled." });
    }

    // 5) get completed lessons for this learner (list of lesson ids)
    const completedRes = await pool.query(
      `SELECT lesson_id FROM learner_completed_lessons WHERE learner_id = $1`,
      [userId]
    );
    const completedLessons = completedRes.rows.map((r) => r.lesson_id);

    // assemble result
    const result = {
      id: course.id,
      title: course.title,
      name: course.name,
      description: course.description,
      imageurl: course.imageurl,
      instructor_name: course.instructor_name,
      trainer: course.trainer_id
        ? {
            _id: course.trainer_id,
            fullName: course.trainer_full_name,
          }
        : null,
      chapters,
      completedLessons,
      enrolled_count: parseInt(course.enrolled_count, 10) || 0, // <-- this will match your frontend
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

//Mark lesson complete
const markLessonComplete = async (req, res) => {
  const lessonId = parseInt(req.body.lessonId, 10);
  const learnerId = parseInt(req.user?.id || req.user?._id, 10);

  if (!lessonId || !learnerId) {
    return res.status(400).json({ message: "Lesson ID and Learner ID are required" });
  }

  try {
    const lessonRes = await pool.query(
      `SELECT l.id AS lesson_id, l.chapter_id, ch.course_id
       FROM lessons l
       LEFT JOIN chapters ch ON l.chapter_id = ch.id
       WHERE l.id = $1`,
      [lessonId]
    );

    if (lessonRes.rows.length === 0) return res.status(404).json({ message: "Lesson not found" });

    const { chapter_id, course_id } = lessonRes.rows[0];
    if (!chapter_id || !course_id) return res.status(404).json({ message: "Lesson does not belong to a valid course" });

    const learnerRes = await pool.query("SELECT id FROM learner WHERE id = $1", [learnerId]);
    if (learnerRes.rows.length === 0) return res.status(404).json({ message: "Learner not found" });

    const enrollRes = await pool.query(
      `SELECT 1 FROM learner_courses WHERE learner_id = $1 AND course_id = $2`,
      [learnerId, course_id]
    );
    if (enrollRes.rows.length === 0) return res.status(403).json({ message: "You are not enrolled in this course" });

    const existsRes = await pool.query(
      `SELECT 1 FROM learner_completed_lessons WHERE learner_id = $1 AND lesson_id = $2`,
      [learnerId, lessonId]
    );
    if (existsRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO learner_completed_lessons (learner_id, lesson_id, created_at)
         VALUES ($1, $2, NOW())`,
        [learnerId, lessonId]
      );
    }

    return res.status(200).json({ message: "Lesson marked as complete" });
  } catch (error) {
    console.error("Error marking lesson complete:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Attempt quiz
const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quizRes = await pool.query(
      `SELECT q.*, c.id AS chapter_id
       FROM quizzes q
       LEFT JOIN chapters c ON q.course_id = c.course_id
       WHERE q.course_id = $1
       ORDER BY q.created_at ASC
       LIMIT 1`,
      [courseId]
    );

    if (quizRes.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quiz = quizRes.rows[0];

    // ✅ Convert snake_case to camelCase
    quiz.chapterId = quiz.chapter_id;

    const questionsRes = await pool.query(
      `SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY id ASC`,
      [quiz.id]
    );

    quiz.questions = questionsRes.rows;

    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Error getting quiz:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Submit quiz attempt
const submitQuizAttempt = async (req, res) => {
  const { quizId, courseId, chapterId, score, totalMarks } = req.body;
  const learnerId = req.user.id;

  try {
    // Validate quiz existence
    const quizRes = await pool.query(`SELECT id FROM quizzes WHERE id = $1`, [quizId]);
    if (quizRes.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Validate learner existence
    const learnerRes = await pool.query(`SELECT id FROM learner WHERE id = $1`, [learnerId]);
    if (learnerRes.rows.length === 0) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Check if the learner has already submitted this quiz
    const existingRes = await pool.query(
      `SELECT id FROM learner_quizzes WHERE learner_id = $1 AND quiz_id = $2`,
      [learnerId, quizId]
    );

    if (existingRes.rows.length > 0) {
      // Update existing attempt and updated_at timestamp
      await pool.query(
        `UPDATE learner_quizzes
         SET marks_scored = $1,
             total_marks = $2,
             chapter_id = $3,
             course_id = $4,
             updated_at = NOW()
         WHERE learner_id = $5 AND quiz_id = $6`,
        [score, totalMarks, chapterId || null, courseId || null, learnerId, quizId]
      );
    } else {
      // Insert new attempt with created_at and updated_at default values
      await pool.query(
        `INSERT INTO learner_quizzes 
         (learner_id, course_id, chapter_id, quiz_id, marks_scored, total_marks, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [learnerId, courseId || null, chapterId || null, quizId, score, totalMarks]
      );
    }

    return res.status(200).json({ message: "Quiz submitted successfully" });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    return res.status(500).json({ message: "Failed to submit quiz" });
  }
};

//Submit course review
const submitReview = async (req, res) => {
  const { courseId, learnerName, rating, comment } = req.body;

  try {
    // Check if the course exists
    const courseRes = await pool.query(`SELECT id FROM courses WHERE id = $1`, [courseId]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Insert review into the reviews table
    const todaysdate = new Date().toISOString().split("T")[0];
    const reviewRes = await pool.query(
      `INSERT INTO reviews (course_id, learner_name, rating, comment, todaysdate, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [courseId, learnerName, rating, comment, todaysdate]
    );

    // Return the created review (like MongoDB)
    return res.status(200).json({
      message: "Review submitted successfully",
      review: reviewRes.rows[0],
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    return res.status(500).json({ message: "Failed to submit review" });
  }
};

// Download certificate (generate PDF) — requires learner passed the course (>=60%)
const downloadCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // Fetch course info
    const courseRes = await pool.query(`SELECT id, title FROM courses WHERE id = $1`, [courseId]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = courseRes.rows[0];

    // Fetch learner
    const learnerRes = await pool.query(`SELECT id, first_name, last_name FROM learner WHERE id = $1`, [userId]);
    if (learnerRes.rows.length === 0) {
      return res.status(404).json({ message: "Learner not found" });
    }
    const learner = learnerRes.rows[0];

    // Find a quiz attempt for this course where score/total >= 0.6
    const quizRecordRes = await pool.query(
      `SELECT * FROM learner_quizzes
       WHERE learner_id = $1 AND course_id = $2
         AND total_marks > 0
         AND (marks_scored::float / total_marks::float) >= 0.6
       LIMIT 1`,
      [userId, courseId]
    );

    if (quizRecordRes.rows.length === 0) {
      return res.status(403).json({ message: "You are not eligible for a certificate" });
    }

    // Generate PDF certificate (similar layout to your Mongo code)
    const doc = new PDFDocument({
      size: [600, 900],
      layout: "landscape",
      margin: 50,
    });
    const fileName = `Certificate-${course.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

    // Top gradient border (approximation)
    const topGradient = doc.linearGradient(25, 25, doc.page.width - 25, 25);
    topGradient.stop(0, "#BA2759").stop(0.5, "#20DAC7").stop(1, "#FFFFFF");
    doc.rect(25, 25, doc.page.width - 50, 20).fill(topGradient);

    // Bottom gradient border
    const bottomGradient = doc.linearGradient(25, doc.page.height - 25, doc.page.width - 25, doc.page.height - 25);
    bottomGradient.stop(0, "#FFFFFF").stop(0.5, "#20DAC7").stop(1, "#BF9F46");
    doc.rect(25, doc.page.height - 45, doc.page.width - 50, 20).fill(bottomGradient);

    // Left and right gradient borders
    const leftGradient = doc.linearGradient(25, 25, 25, doc.page.height - 25);
    leftGradient.stop(0, "#BA2759").stop(0.5, "#20DAC7").stop(1, "#FFFFFF");
    doc.rect(25, 25, 20, doc.page.height - 50).fill(leftGradient);

    const rightGradient = doc.linearGradient(doc.page.width - 25, 25, doc.page.width - 25, doc.page.height - 25);
    rightGradient.stop(0, "#FFFFFF").stop(0.5, "#20DAC7").stop(1, "#BF9F46");
    doc.rect(doc.page.width - 45, 25, 20, doc.page.height - 50).fill(rightGradient);

    // Logo (if exists)
    const logoPath = path.join(__dirname, "../assets/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 100, 30, { width: 200 });
    }
    doc.moveDown(11);

    // Title and learner/course info
    doc.font("Times-Bold").fontSize(30).fillColor("#000").text("Certificate of Completion", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(20).fillColor("#000").text("This certifies that", { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(36).fillColor("#E93131").text(`${learner.first_name} ${learner.last_name}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(20).fillColor("#000").text("has successfully completed the course", { align: "center" });
    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(28).fillColor("#060270").text(`"${course.title}"`, { align: "center" });
    doc.moveDown(1);
    const certificateDate = new Date().toLocaleDateString();
    doc.fontSize(18).fillColor("#000").text(`Date: ${certificateDate}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).fillColor("#888").text("Powered by Learnfinity", {
      align: "center",
      baseline: "bottom",
    });

    doc.end();
  } catch (err) {
    console.error("Error generating certificate:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to generate certificate" });
    }
  }
};

module.exports = { getEnrolledCourses,markLessonComplete,getQuiz,submitQuizAttempt,submitReview,downloadCertificate };
