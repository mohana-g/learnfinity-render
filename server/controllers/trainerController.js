const pool = require("../config/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const Course = require("../models/Course");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/**
 * ✅ Trainer Signup
 */
const trainerSignUp = async (req, res) => {
  const { fullName, institute, phoneNumber, email, gender, password, confirmPassword } = req.body;

  if (!fullName || !institute || !phoneNumber || !email || !gender || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if trainer already exists
    const existingTrainer = await pool.query(
      "SELECT * FROM trainer WHERE phone_number = $1 OR email = $2",
      [phoneNumber, email]
    );

    if (existingTrainer.rows.length > 0) {
      return res.status(400).json({ error: "Trainer with this phone number or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Trainer table
    const newTrainer = await pool.query(
      `INSERT INTO trainer (full_name, institute, phone_number, email, gender, password)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email`,
      [fullName, institute, phoneNumber, email, gender, hashedPassword]
    );

    const trainerId = newTrainer.rows[0].id;

    // Insert into User table
    await pool.query(
      `INSERT INTO users (email, password, role, trainer_id)
       VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, 2, trainerId] // 2 = Trainer role
    );

    // Generate JWT
    const token = jwt.sign({ id: trainerId, role: "trainer" }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ success: true, token, message: "Trainer registered successfully!" });
  } catch (err) {
    console.error("Error during trainer signup:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * ✅ Add Course (Only Approved Trainers)
 */
const addCourse = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { title, name, description } = req.body;

    if (!trainerId)
      return res.status(401).json({ message: "Unauthorized: Trainer ID not found" });
    if (!title || !name || !description)
      return res.status(400).json({ message: "Title, name, and description are required" });

    // ✅ 1. Check if trainer exists
    const trainer = await pool.query("SELECT * FROM trainer WHERE id = $1", [trainerId]);
    if (trainer.rows.length === 0)
      return res.status(404).json({ message: "Trainer not found" });

    const instructorName = trainer.rows[0].full_name; // ✅ Get trainer name
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ 2. Insert course into 'courses' table (with instructor name)
    const newCourse = await pool.query(
      `INSERT INTO courses (title, name, description, imageurl, instructor_name, trainer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, name, description, imageurl, instructor_name, trainer_id`,
      [title, name, description, imagePath, instructorName, trainerId]
    );

    const courseId = newCourse.rows[0].id;

    // ✅ 3. Also link trainer and course in 'trainer_courses' table
    await pool.query(
      `INSERT INTO trainer_courses (trainer_id, course_id)
       VALUES ($1, $2)`,
      [trainerId, courseId]
    );

    // ✅ 4. Respond success
    res.status(201).json({
      success: true,
      message: "Course added successfully!",
      course: newCourse.rows[0],
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Trainer's Courses
const getTrainerCourses = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const courses = await pool.query(
      `SELECT 
          c.*, 
          t.full_name AS trainer_name,
          COUNT(lc.learner_id) AS enrolled_count
       FROM courses c
       JOIN trainer t ON c.trainer_id = t.id
       LEFT JOIN learner_courses lc ON lc.course_id = c.id
       WHERE c.trainer_id = $1
       GROUP BY c.id, t.full_name
       ORDER BY c.created_at DESC`,
      [trainerId]
    );

    res.status(200).json({ success: true, data: courses.rows });
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
};

/**
 * ✅ Get Trainer Profile
 */
const getTrainerProfile = async (req, res) => {
  try {
    const trainer = await pool.query(
      "SELECT id, full_name, institute, phone_number, email, gender FROM trainer WHERE id = $1",
      [req.user.id]
    );
    if (trainer.rows.length === 0) return res.status(404).json({ message: "Trainer not found" });
    res.json(trainer.rows[0]);
  } catch (error) {
    console.error("Error fetching trainer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Update Trainer Profile
 */
const updateTrainerProfile = async (req, res) => {
  try {
    const { fullName, institute, phoneNumber } = req.body;

    // Update trainer and return the updated row
    const updatedTrainer = await pool.query(
      `UPDATE trainer SET 
         full_name = COALESCE($1, full_name),
         institute = COALESCE($2, institute),
         phone_number = COALESCE($3, phone_number),
         updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [fullName, institute, phoneNumber, req.user.id]
    );

    // Check if trainer exists
    if (updatedTrainer.rows.length === 0) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.json({
      message: "Profile updated successfully!",
      trainer: updatedTrainer.rows[0],
    });
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ✅ Update Trainer Password
 */
const updateTrainerPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Fetch trainer
    const trainerResult = await pool.query("SELECT * FROM trainer WHERE id = $1", [req.user.id]);
    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    const trainer = trainerResult.rows[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, trainer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Generate salt and hash new password (same as MongoDB)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update trainer password
    await pool.query("UPDATE trainer SET password = $1 WHERE id = $2", [hashedPassword, req.user.id]);

    // Update user password
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, trainer.email]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  trainerSignUp,
  addCourse,
  getTrainerProfile,
  updateTrainerProfile,
  updateTrainerPassword,
  getTrainerCourses,
};
