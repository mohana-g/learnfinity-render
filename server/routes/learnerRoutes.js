// routes/LearnerRoutes.js

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

    // Find Learners who are enrolled in the given courseId
    const learners = await Learner.find({ courses: courseId }).select("email");

    if (!learners || learners.length === 0) {
      return res.status(404).json({ success: false, message: "No Learners enrolled in this course" });
    }

    // Extract Learner emails
    const learnerEmails = learners.map(learner => learner.email);

    res.json({ success: true, data: learnerEmails });
  } catch (error) {
    console.error("Error fetching enrolled Learners' emails:", error);
    res.status(500).json({ success: false, message: "Error fetching Learner emails" });
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
    const learner = await Learner.findById(req.user.id).select("-password");
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Learner profile
router.put("/profile/update", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, dob, address } = req.body;

    const learner = await Learner.findById(req.user.id);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    learner.firstName = firstName || learner.firstName;
    learner.lastName = lastName || lastNameearner.lastName;
    learner.phone = phone || learner.phone;
    learner.dob = dob || learner.dob;
    learner.address = address || learner.address;
    learner.updatedAt = Date.now();

    await learner.save();
    res.json({ message: "Profile updated successfully!",learner });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Update Learner password
router.put("/update-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find Learner by ID
    const learner = await Learner.findById(req.user.id);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, learner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update Learner collection
    await learner.updateOne({ _id: Learner._id }, { $set: { password: hashedPassword } });

    // Update User collection by matching the email
    await User.updateOne({ email: learner.email }, { $set: { password: hashedPassword } });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const learners = await Learner.find().populate('courses');

    const leaderboard = learners.map(learner => {
      const totalMarks = learner.quizzes?.reduce((sum, quiz) => sum + (quiz.marksScored || 0), 0) || 0;

      return {
        _id: learner._id,
        name: `${learner.firstName} ${learner.lastName}`,
        email: learner.email || '',
        phone: learner.phone || '',
        totalMarks,
        enrolledCourses: learner.courses.map(course => course?.title || 'Unnamed Course'),
        DateofJoined: learner.createdAt || null,
      };
    });

    leaderboard.sort((a, b) => b.totalMarks - a.totalMarks);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get logged-in Learner's progress
router.get('/progress', authMiddleware, getLoggedInLearnerProgress);

module.exports = router;
