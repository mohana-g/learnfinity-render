// // controllers/careerPathController.js
// const CareerPath = require("../models/CareerPath");
// const Learner = require("../models/Learner");
// const Course = require("../models/Course");
// const Trainer = require("../models/Trainer");
// const Chapter = require("../models/Chapter");
// const Quiz = require("../models/Quiz");
// const Lesson = require("../models/Lesson");
// const mongoose = require("mongoose");

// exports.getCareerPaths = async (req, res) => {
//   try {
//     const paths = await CareerPath.find().populate({
//       path: "levels.courses",
//       select: "title imageurl name"
//     });
//     res.status(200).json({ data: paths });
//   } catch (err) {
//     console.error("CareerPath fetch error:", err);
//     res.status(500).json({ message: "Error fetching career paths", error: err.message });
//   }
// };

// exports.getCareerPathById = async (req, res) => {
//   try {
//     const path = await CareerPath.findById(req.params.id).populate({
//       path: "levels.courses",
//       select: "title description imageurl name"
//     });

//     if (!path) {
//       return res.status(404).json({ message: "Career path not found" });
//     }
//     res.status(200).json({ data: path });
//   } catch (err) {
//     console.error("CareerPath by ID error:", err);
//     res.status(500).json({ message: "Error fetching career path details", error: err.message });
//   }
// };

const CareerPath = require("../models/CareerPath");

// GET all career paths
exports.getCareerPaths = async (req, res) => {
  try {
    const paths = await CareerPath.find().populate("courses.courseId", "title");
    res.json(paths);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST create new career path
exports.createCareerPath = async (req, res) => {
  try {
    const newPath = new CareerPath(req.body);
    const saved = await newPath.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// PUT update career path
exports.updateCareerPath = async (req, res) => {
  try {
    const updated = await CareerPath.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "CareerPath not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// DELETE career path
exports.deleteCareerPath = async (req, res) => {
  try {
    const deleted = await CareerPath.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "CareerPath not found" });
    res.json({ message: "CareerPath deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
