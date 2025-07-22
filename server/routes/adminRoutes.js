/*const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => res.send("Register Admin"));
router.get("/pending-Trainers", (req, res) => res.send("Get Pending Trainers"));
router.patch("/accept-Trainer/:id", (req, res) => res.send(`Accept Trainer with ID ${req.params.id}`));
router.patch("/decline-Trainer/:id", (req, res) => res.send(`Decline Trainer with ID ${req.params.id}`));
router.patch("/block-user/:id", (req, res) => res.send(`Block/Unblock User with ID ${req.params.id}`));
router.delete("/delete-user/:id", (req, res) => res.send(`Delete User with ID ${req.params.id}`));
router.post("/send-mail", (req, res) => res.send("Send Mail"));
router.delete("/delete-course/:id", (req, res) => res.send(`Delete Course with ID ${req.params.id}`));
router.post("/add-course", (req, res) => res.send("Add New Course"));

module.exports = router;
*/
/*
const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const Learner = require("../models/Learner");
const Trainer = require("../models/Trainer");

const router = express.Router();

// Get All Users (Admin Only)
router.get("/users", async (req, res) => {
  try {
    // Fetch all Learners and format the fields
    const Learners = await Learner.find({}, "firstName lastName email phone dob profileImage")
      .lean()  // Converts Mongoose documents to plain JS objects
      .then(Learners => Learners.map(Learner => ({
        _id: Learner._id,
        name: `${Learner.firstName} ${Learner.lastName}`, // Combine first and last name
        email: Learner.email,
        phone: Learner.phone,
        dob: Learner.dob,
        role: "Learner",
        profileImage: Learner.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
      })));

    // Fetch all Trainers and format the fields
    const Trainers = await Trainer.find({}, "fullName email phoneNumber institute profileImage")
      .lean()
      .then(Trainers => Trainers.map(Trainer => ({
        _id: Trainer._id,
        name: Trainer.fullName, // Use correct field name
        email: Trainer.email,
        phone: Trainer.phoneNumber, // Use correct field name
        institute: Trainer.institute, // Include institute
        role: "Trainer",
        profileImage: Trainer.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
      })));

    // Merge Learners and Trainers
    const users = [...Learners, ...Trainers];

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Block User Route
router.put("/block-user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.flag = 1; // Set flag to 1 (Blocked)
    await user.save();

    res.json({ success: true, message: "User blocked successfully", user });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ Unblock User Route
router.put("/unblock-user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.flag = 0; // Set flag to 0 (Unblocked)
    await user.save();

    res.json({ success: true, message: "User unblocked successfully", user });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Delete User (Removes from Learner & Trainer Tables)
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove related Learner or Trainer data
    if (user.role === 0) { // Learner
      await Learner.findOneAndDelete({ userId: user._id });
    } else if (user.role === 2) { // Trainer
      await Trainer.findOneAndDelete({ userId: user._id });
      
      // Optionally, delete courses created by this Trainer
      await Course.deleteMany({ TrainerId: user._id });
    }

    // Finally, delete the user from the Users table
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Get Pending Trainer Approvals
router.get("/pending-Trainers", async (req, res) => {
  try {
    const Trainers = await User.find({ role: 2, isApproved: false });
    res.json({ Trainers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Trainers", error });
  }
});

// Approve Trainer
router.put("/approve-Trainer/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: "Trainer approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving Trainer", error });
  }
});

// Decline Trainer
router.put("/decline-Trainer/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Trainer declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error declining Trainer", error });
  }
});

// Get All Courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

// Add Course (Verify Trainer)
router.post("/add-course", async (req, res) => {
  const { title, description, TrainerId } = req.body;

  try {
    // Validate Trainer
    const Trainer = await User.findOne({ _id: TrainerId, role: 2 });
    if (!Trainer) {
      return res.status(400).json({ message: "Invalid Trainer ID" });
    }

    const newCourse = new Course({ title, description, TrainerId });
    await newCourse.save();
    res.json({ message: "Course added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
});

// Delete Course
router.delete("/delete-course/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

module.exports = router;
*/
const mongoose = require("mongoose");

const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// User Management
router.get("/users", adminController.getUsers);
router.put("/block-user/:id", adminController.blockUser);
router.put("/unblock-user/:id", adminController.unblockUser);
router.delete("/delete-user/:id", adminController.deleteUser);

// Trainer Approval
router.get("/pending-trainers", adminController.getPendingTrainers);
router.put("/approve-trainer/:id", adminController.approveTrainer);
router.put("/decline-trainer/:id", adminController.declineTrainer);

// Course Management
router.get("/trainers", adminController.getTrainers);
router.post("/add-course", upload.single("image"), adminController.addCourse);
router.get("/courses", adminController.getCourses);
router.delete("/delete-course/:id", adminController.deleteCourse);

// Learner Progress
router.get('/learners-progress', adminController.getLearnersProgress);

module.exports = router;
