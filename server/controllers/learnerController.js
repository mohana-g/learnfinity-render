// controllers/LearnerController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Learner = require('../models/Learner');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const User = require("../models/User");
const Course = require("../models/Course");

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Handle Learner signup
const learnerSignUp = async (req, res) => {
  const { firstName, lastName, dob, email, phone, password, address} = req.body;

  // Validate the input data
  if (!firstName || !lastName || !dob || !email || !phone || !password ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if Learner already exists
    const existingLearner = await Learner.findOne({ $or: [{ email }, { phone }] });
    if (existingLearner) {
      return res.status(400).json({ error: 'Learner with this email or phone number already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Learner
    const learner = new Learner({
      firstName,
      lastName,
      dob,
      email,
      phone,
      password: hashedPassword,
      address:"",
      courses: [], // Empty initially
      quizzes: [], // Empty initially
      completedLessons: [], // Empty initially
    });

    // Save Learner to the database
    await learner.save();

    // Create a corresponding user entry
    const user = new User({
      email,
      password: hashedPassword, // Save the same hashed password
      learner: learner._id, // Link to the Learner document
      role: 0, // Role: 0 for Learners
    });

    // Save user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: learner._id, role: 'learner' }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      success: true,
      token,
      message: 'Learner registered successfully!',
    });
  } catch (err) {
    console.error('Error during learner signup:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get enrolled courses for a Learner
const getEnrolledCourses = async (req, res) => {
  try {
    const learnerId = req.user.id; // Assuming authMiddleware sets req.user
    const courses = await Course.find({ learners: learnerId }).populate("trainer", "fullName");

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Error fetching enrolled courses" });
  }
};

// Update Learner profile
const getLoggedInLearnerProgress = async (req, res) => {
  try {
    const learner = await Learner.findById(req.user.id)
      .populate({
        path: 'courses',
        populate: [
          { path: 'chapters', populate: { path: 'lessons' } },
          { path: 'quizzes' }
        ]
      })
      .populate('completedLessons');

    if (!learner) {
      return res.status(404).json({ error: 'Learner not found' });
    }

    const enrolledCourses = learner.courses.map((course) => {
      const totalLessons = course.chapters.reduce((count, chapter) => {
        return count + (chapter.lessons?.length || 0);
      }, 0);

      const courseLessonIds = course.chapters.flatMap(ch =>
        ch.lessons.map(lesson => lesson._id.toString())
      );

      const completedLessonsCount = learner.completedLessons.filter(lesson =>
        courseLessonIds.includes(lesson._id.toString())
      ).length;

      const completedQuizzesCount = learner.quizzes.filter(q =>
        q.course?.toString() === course._id.toString()
      ).length;

      const totalQuizzes = course.quizzes.length;
      const totalItems = totalLessons + totalQuizzes;
      const completedItems = completedLessonsCount + completedQuizzesCount;

      const progressPercent = totalItems > 0 ? ((completedItems / totalItems) * 100).toFixed(0) : 0;

      return {
        courseId: course._id,
        courseTitle: course.title,
        totalChapters: course.chapters.length,
        totalLessons,
        completedLessons: completedLessonsCount,
        totalQuizzes,
        completedQuizzes: completedQuizzesCount,
        progressPercent
      };
    });

    res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: "Error fetching Learner progress" });
  }
};

module.exports = { learnerSignUp, getEnrolledCourses, getLoggedInLearnerProgress };
