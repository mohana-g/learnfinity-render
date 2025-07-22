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
    const existingTrainer = await Trainer.findOne({ $or: [{ phoneNumber }, { email }] });
    if (existingTrainer) {
      return res.status(400).json({ error: "Trainer with this phone number or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTrainer = new Trainer({
      fullName,
      institute,
      phoneNumber,
      email,
      gender,
      password: hashedPassword,
      courses: [],
    });

    await newTrainer.save();

    const newUser = new User({
      email,
      password: hashedPassword,
      trainer: newTrainer._id,
      role: 2, // Role 2 for Trainers
    });

    await newUser.save();

    const token = jwt.sign({ id: newTrainer._id, role: "trainer" }, JWT_SECRET, { expiresIn: "1h" });

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
    // Extract Trainer ID from the authenticated user (assuming JWT middleware attaches it)
    const trainerId = req.user.id;

    if (!trainerId) {
      return res.status(401).json({ message: "Unauthorized: Trainer ID not found" });
    }

    const { title, name, description } = req.body;

    if (!title || !name || !description) {
      return res.status(400).json({ message: "Title, name, and description are required" });
    }

    // Find Trainer in the database
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Handle image file if uploaded
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new course and associate it with the Trainer
    const newCourse = new Course({
      title,
      name,
      description,
      imageurl: imagePath,
      trainer: trainerId, // Automatically assigned
    });

    // Save course to DB
    await newCourse.save();

    // Add course ID to the Trainer's list of courses
    trainer.courses.push(newCourse._id);
    await trainer.save();

    res.status(201).json({
      success: true,
      message: "Course added successfully!",
      course: newCourse,
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
    const courses = await Course.find({ trainer: trainerId }).populate("trainer", "fullName");

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching courses", error });
  }
};

/**
 * ✅ Get Trainer Profile
 */
const getTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id).select("-password");
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Update Trainer Profile
 */
const updateTrainerProfile = async (req, res) => {
  try {
    const { fullName, institute, phoneNumber } = req.body;

    const trainer = await Trainer.findById(req.user.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    trainer.fullName = fullName || trainer.fullName;
    trainer.institute = institute || trainer.institute;
    trainer.phoneNumber = phoneNumber || trainer.phoneNumber;
    trainer.updatedAt = Date.now();

    await trainer.save();
    res.json({ message: "Profile updated successfully!", trainer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Update Trainer Password
 */
const updateTrainerPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const trainer = await Trainer.findById(req.user.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, trainer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Trainer.updateOne({ _id: trainer._id }, { $set: { password: hashedPassword } });
    await User.updateOne({ email: trainer.email }, { $set: { password: hashedPassword } });

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
