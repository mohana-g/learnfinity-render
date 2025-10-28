// routes/LearnerRoutes.js
const pool = require("../config/db");

const express = require('express');
const bcrypt = require("bcryptjs");
const { learnerSignUp, getEnrolledCourses, getLoggedInLearnerProgress } = require('../controllers/learnerController');
const Learner = require('../models/Learner');
const User = require('../models/User');
const Course = require('../models/Course');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to handle Learner signup
router.post('/signup', learnerSignUp);

// Route to get enrolled courses for a Learner
router.get("/enrolled-courses", authMiddleware, getEnrolledCourses);

// Fetch emails of Learners enrolled in a specific course---------------new code now working on this
router.get("/learners/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      `SELECT l.email
       FROM learner l
       JOIN learner_courses lc ON lc.learner_id = l.id
       WHERE lc.course_id = $1`,
      [courseId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "No learners enrolled in this course" });

    const learnerEmails = result.rows.map((row) => row.email);
    res.json({ success: true, data: learnerEmails });
  } catch (error) {
    console.error("Error fetching learner emails:", error);
    res.status(500).json({ success: false, message: "Error fetching learner emails" });
  }
});


/* The old send mail code
// Route to fetch all Learner emails
router.get('/Learners', async (req, res) => {
    try {
        const Learners = await Learner.find({});  // No role filtering
        //console.log("Fetched Learners:", Learners); // Log fetched Learners
  
      const LearnerEmails = Learners.map(Learner => ({
        email: Learner.email
      }));
  
      res.json(LearnerEmails);
    } catch (error) {
      console.error("Error fetching Learners:", error);
      res.status(500).send('Error fetching Learners');
    }
  });
*/

// Get Learner profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const learner = await pool.query(
      `SELECT id, first_name, last_name, phone, dob, address, email, created_at
       FROM learner
       WHERE id = $1`,
      [req.user.id]
    );

    if (learner.rows.length === 0)
      return res.status(404).json({ message: "Learner not found" });

    res.json(learner.rows[0]);
  } catch (error) {
    console.error("Error fetching learner profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Update Learner profile
router.put("/profile/update", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, dob, address } = req.body;

    const updated = await pool.query(
      `UPDATE learner SET
         first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         phone = COALESCE($3, phone),
         dob = COALESCE($4, dob),
         address = COALESCE($5, address),
         updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [firstName, lastName, phone, dob, address, req.user.id]
    );

    if (updated.rows.length === 0)
      return res.status(404).json({ message: "Learner not found" });

    res.json({ message: "Profile updated successfully", learner: updated.rows[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Learner password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const learnerResult = await pool.query("SELECT * FROM learner WHERE id = $1", [req.user.id]);
    if (learnerResult.rows.length === 0)
      return res.status(404).json({ message: "Learner not found" });

    const learner = learnerResult.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, learner.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE learner SET password = $1 WHERE id = $2", [hashedPassword, req.user.id]);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, learner.email]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
      l.id,
      l.first_name,
      l.last_name,
      l.email,
      l.phone,
      l.created_at AS date_of_joined,
      COALESCE(m.total_marks, 0) AS total_marks,
      COALESCE(
        JSON_AGG(DISTINCT c.title) FILTER (WHERE c.title IS NOT NULL),
        '[]'
      ) AS enrolled_courses
    FROM learner l
    LEFT JOIN (
      SELECT learner_id, SUM(marks_scored) AS total_marks
      FROM learner_quizzes
      GROUP BY learner_id
    ) m ON m.learner_id = l.id
    LEFT JOIN learner_courses lc ON lc.learner_id = l.id
    LEFT JOIN courses c ON c.id = lc.course_id
    GROUP BY l.id, m.total_marks
    ORDER BY total_marks DESC;
    `);

    const leaderboard = result.rows.map(row => ({
      _id: row.id,
      name: `${row.first_name} ${row.last_name}`,
      email: row.email || '',
      phone: row.phone || '',
      totalMarks: parseInt(row.total_marks, 10),
      enrolledCourses: row.enrolled_courses,
      DateofJoined: row.date_of_joined || null,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Get logged-in Learner's progress
router.get('/progress', authMiddleware, getLoggedInLearnerProgress);

module.exports = router;
