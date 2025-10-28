/*const User = require('../models/User');
const Course = require('../models/Course');
const Trainer = require('../models/Trainer');

// Fetch all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Block user
const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.flag = 1; // Blocked
        await user.save();
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch pending Trainers
const getPendingTrainers = async (req, res) => {
    try {
        const Trainers = await Trainer.find({ flag: 0 });
        res.json(Trainers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve Trainer
const approveTrainer = async (req, res) => {
    try {
        const Trainer = await Trainer.findById(req.params.id);
        Trainer.flag = 1; // Approved
        await Trainer.save();
        res.json({ message: 'Trainer approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Decline Trainer
const declineTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer declined successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, blockUser, deleteUser, getCourses, deleteCourse, getPendingTrainers, approveTrainer, declineTrainer };
*/


const pool = require("../config/db");

const User = require("../models/User");
const Learner = require("../models/Learner");
const Trainer = require("../models/Trainer");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Review = require("../models/Review");


// Get All Users (Learners & Trainers)
/*const getUsers = async (req, res) => {
  try {
    const Learners = await Learner.find({}, "firstName lastName email phone dob profileImage").lean();
    const Trainers = await Trainer.find({}, "fullName email phoneNumber institute profileImage").lean();

    const formattedLearners = Learners.map(Learner => ({
      _id: Learner._id,
      name: `${Learner.firstName} ${Learner.lastName}`,
      email: Learner.email,
      phone: Learner.phone,
      dob: Learner.dob,
      role: "Learner",
      profileImage: Learner.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    }));

    const formattedTrainers = Trainers.map(Trainer => ({
      _id: Trainer._id,
      name: Trainer.fullName,
      email: Trainer.email,
      phone: Trainer.phoneNumber,
      institute: Trainer.institute,
      role: "Trainer",
      profileImage: Trainer.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    }));

    res.json({ users: [...formattedLearners, ...formattedTrainers] });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/

//get all users
const getUsers = async (req, res) => {
  try {
    const query = `
      SELECT
          u.id,
          u.email,
          u.flag,
          u.role,
          u.created_at AS "createdAt",
          json_build_object(
              'dob', l.dob,
              'phone', l.phone,
              'firstName', l.first_name,
              'lastName', l.last_name
          ) AS learner,
          json_build_object(
              'institute', t.institute,
              'phone', t.phone_number,
              'fullName', t.full_name
          ) AS trainer,
          json_build_object(
              'fullName', a.full_name,
              'email', a.email,
              'phone', a.phone_no
          ) AS admin
      FROM public.users u
      LEFT JOIN public.learner l ON u.learner_id = l.id
      LEFT JOIN public.trainer t ON u.trainer_id = t.id
      LEFT JOIN public."admin" a ON u.admin_id = a.id;
    `;

    const { rows: users } = await pool.query(query);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Block User
const blockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const { rowCount } = await pool.query(
      `UPDATE public.users SET flag = 1 WHERE id = $1`,
      [userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unblock User
const unblockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const { rowCount } = await pool.query(
      `UPDATE public.users SET flag = 0 WHERE id = $1`,
      [userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    // First, get the associated learner_id and trainer_id
    const { rows } = await pool.query(
      `SELECT learner_id, trainer_id FROM public.users WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const { learner_id, trainer_id } = rows[0];

    // Delete associated learner
    if (learner_id) {
      await pool.query(`DELETE FROM public.learner WHERE id = $1`, [learner_id]);
    }

    // Delete associated trainer
    if (trainer_id) {
      await pool.query(`DELETE FROM public.trainer WHERE id = $1`, [trainer_id]);
    }

    // Delete the user
    await pool.query(`DELETE FROM public.users WHERE id = $1`, [userId]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Pending Trainers (flag = 0)
const getPendingTrainers = async (req, res) => {
  try {
    const { rows: trainers } = await pool.query(
      `SELECT id, full_name, email, phone_number, institute 
       FROM public.trainer 
       WHERE flag = 0`
    );

    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Approve Trainer (set flag = 2)
const approveTrainer = async (req, res) => {
  const trainerId = req.params.id;
  try {
    const { rowCount } = await pool.query(
      `UPDATE public.trainer 
       SET flag = 2 
       WHERE id = $1`,
      [trainerId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Trainer not found" });

    res.json({ message: "Trainer approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Decline Trainer (set flag = 3 instead of deleting)
const declineTrainer = async (req, res) => {
  const trainerId = req.params.id;
  try {
    const { rowCount } = await pool.query(
      `UPDATE public.trainer 
       SET flag = 3 
       WHERE id = $1`,
      [trainerId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Trainer not found" });

    res.json({ message: "Trainer declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all approved Trainers (flag = 2)
const getTrainers = async (req, res) => {
  try {
    const { rows: trainers } = await pool.query(
      `SELECT id, full_name, email, phone_number, institute 
       FROM public.trainer 
       WHERE flag = 2`
    );

    res.json({ trainers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY created_at ASC");
    res.json({ courses: result.rows });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/*
// Add Course (Ensures Trainer is Valid)
const addCourse = async (req, res) => {
  try {
    const { title, description, TrainerId } = req.body;

    const Trainer = await Trainer.findById(TrainerId);
    if (!Trainer) return res.status(400).json({ message: "Invalid Trainer ID" });

    const newCourse = new Course({ title, description, TrainerId });
    await newCourse.save();

    res.json({ message: "Course added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
*/
//new add course
const addCourse = async (req, res) => {
  try {
    const { title, name, description, trainerId } = req.body;

    if (!title || !name || !trainerId) {
      return res.status(400).json({ message: "Title, name, and trainerId are required" });
    }

    const trainerCheck = await pool.query("SELECT full_name FROM trainer WHERE id = $1", [trainerId]);
    if (trainerCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid Trainer ID" });
    }

    const instructorName = trainerCheck.rows[0].full_name;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const insertQuery = `
      INSERT INTO courses (title, name, description, instructor_name, trainer_id, imageurl, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const values = [title, name, description, instructorName, trainerId, imagePath];
    const result = await pool.query(insertQuery, values);
    const newCourseId = result.rows[0].id;

    // ✅ Insert mapping into trainer_courses table
    await pool.query(
      `INSERT INTO trainer_courses (trainer_id, course_id) VALUES ($1, $2)`,
      [trainerId, newCourseId]
    );
    
    res.status(201).json({ success: true, message: "Course added successfully!", course: result.rows[0] });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // ✅ 1. Check if the course exists
    const courseCheck = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ 2. Delete all related lessons → chapters → quizzes → reviews
    // (If you already set ON DELETE CASCADE in your schema, you can skip most of this manual cleanup)

    // Delete lessons linked to chapters of this course
    await pool.query(
      `DELETE FROM lessons 
       WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = $1)`,
      [courseId]
    );

    // Delete chapters linked to this course
    await pool.query("DELETE FROM chapters WHERE course_id = $1", [courseId]);

    // Delete quizzes linked to this course
    await pool.query("DELETE FROM quizzes WHERE course_id = $1", [courseId]);

    // Delete reviews linked to this course
    await pool.query("DELETE FROM reviews WHERE course_id = $1", [courseId]);

    // ✅ 3. Finally, delete the course itself
    await pool.query("DELETE FROM courses WHERE id = $1", [courseId]);

    res.json({ message: "Course deleted successfully" });

  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Get Learners Progress 
const getLearnersProgress = async (req, res) => {
  try {
    const learnersQuery = `
      SELECT 
        l.id AS learner_id, 
        l.first_name, 
        l.last_name, 
        l.email,
        c.id AS course_id, 
        c.title AS course_title
      FROM learner l
      JOIN learner_courses lc ON lc.learner_id = l.id
      JOIN courses c ON c.id = lc.course_id
      ORDER BY l.id, c.id;
    `;
    const learnersResult = await pool.query(learnersQuery);

    const learnerMap = {};

    for (const row of learnersResult.rows) {
      if (!learnerMap[row.learner_id]) {
        learnerMap[row.learner_id] = {
          id: row.learner_id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          enrolledCourses: []
        };
      }

      // ✅ Get total chapters for the course
      const chaptersQuery = `
        SELECT COUNT(id) AS total_chapters
        FROM chapters
        WHERE course_id = $1;
      `;
      const chaptersResult = await pool.query(chaptersQuery, [row.course_id]);
      const totalChapters = parseInt(chaptersResult.rows[0].total_chapters, 10);

      // ✅ Get total lessons
      const lessonsQuery = `
        SELECT COUNT(l.id) AS total_lessons
        FROM chapters ch
        LEFT JOIN lessons l ON l.chapter_id = ch.id
        WHERE ch.course_id = $1;
      `;
      const lessonsResult = await pool.query(lessonsQuery, [row.course_id]);
      const totalLessons = parseInt(lessonsResult.rows[0].total_lessons, 10);

      // ✅ Get completed lessons
      const completedLessonsQuery = `
        SELECT COUNT(lcl.lesson_id) AS completed_lessons
        FROM learner_completed_lessons lcl
        JOIN lessons l ON l.id = lcl.lesson_id
        JOIN chapters ch ON ch.id = l.chapter_id
        WHERE lcl.learner_id = $1 AND ch.course_id = $2;
      `;
      const completedLessonsResult = await pool.query(completedLessonsQuery, [row.learner_id, row.course_id]);
      const completedLessons = parseInt(completedLessonsResult.rows[0].completed_lessons, 10);

      // ✅ Get total quizzes
      const quizzesQuery = `SELECT COUNT(id) AS total_quizzes FROM quizzes WHERE course_id = $1;`;
      const quizzesResult = await pool.query(quizzesQuery, [row.course_id]);
      const totalQuizzes = parseInt(quizzesResult.rows[0].total_quizzes, 10);

      // ✅ Get completed quizzes
      const completedQuizzesQuery = `
        SELECT COUNT(id) AS completed_quizzes
        FROM learner_quizzes
        WHERE learner_id = $1 AND course_id = $2;
      `;
      const completedQuizzesResult = await pool.query(completedQuizzesQuery, [row.learner_id, row.course_id]);
      const completedQuizzes = parseInt(completedQuizzesResult.rows[0].completed_quizzes, 10);

      // ✅ Calculate progress
      const totalItems = totalLessons + totalQuizzes;
      const completedItems = completedLessons + completedQuizzes;
      const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      learnerMap[row.learner_id].enrolledCourses.push({
        courseTitle: row.course_title,
        totalChapters,
        totalLessons,
        completedLessons,
        totalQuizzes,
        completedQuizzes,
        progressPercent
      });
    }

    res.status(200).json(Object.values(learnerMap));
  } catch (error) {
    console.error("Error fetching Learner progress:", error);
    res.status(500).json({ error: "An error occurred while fetching Learner progress" });
  }
};


module.exports = {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getPendingTrainers,
  approveTrainer,
  declineTrainer,
  getTrainers,
  getCourses,
  addCourse,
  deleteCourse,
  getLearnersProgress
};
