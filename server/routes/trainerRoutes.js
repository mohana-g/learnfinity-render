const express = require("express");
const router = express.Router();
const { trainerSignUp, addCourse, getTrainerProfile, updateTrainerProfile, updateTrainerPassword, getTrainerCourses } = require("../controllers/trainerController");
const { approveTrainer, declineTrainer, getPendingTrainers } = require("../controllers/adminController");
const checkTrainerStatus = require("../middleware/checkTrainerStatus");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Middleware to check if Trainer is approved
const checkTrainerApproved = (req, res, next) => {
  if (req.trainer.flag === 0) {
    return res.status(403).json({ message: "Your account is under review. You cannot add courses yet." });
  }
  next();
};

// ✅ **Trainer Signup**
router.post("/trainer-signup", trainerSignUp);

// ✅ **Admin: Get Pending Trainers**
router.get("/pending-trainers", getPendingTrainers);

// ✅ **Admin: Approve or Decline Trainer**
router.put("/approve-trainer/:id", approveTrainer);
router.put("/decline-trainer/:id", declineTrainer);

// ✅ **Trainer Dashboard (Accessible by Pending & Approved Trainers)**
router.get("/dashboard", checkTrainerStatus, (req, res) => {
  res.json({ message: "Welcome to the Trainer Dashboard!" });
});

// ✅ **Add Course (Only Approved Trainers)**
router.post("/add-course", authMiddleware, checkTrainerStatus, checkTrainerApproved, upload.single("image"), addCourse);

// ✅ **Trainer Profile**
router.get("/profile", authMiddleware, getTrainerProfile);
router.put("/profile/update", authMiddleware, updateTrainerProfile);
router.put("/update-password", authMiddleware, updateTrainerPassword);

// ✅ Fetch Trainer's Courses
router.get("/trainer-courses", authMiddleware, getTrainerCourses);

module.exports = router;
