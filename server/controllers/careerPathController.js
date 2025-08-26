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



//correct old code
// const CareerPath = require("../models/CareerPath");

// // GET all career paths
// exports.getCareerPaths = async (req, res) => {
//   try {
//     const paths = await CareerPath.find().populate("courses.courseId", "title");
//     res.json(paths);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // POST create new career path
// exports.createCareerPath = async (req, res) => {
//   try {
//     const newPath = new CareerPath(req.body);
//     const saved = await newPath.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data", details: err.message });
//   }
// };

// // PUT update career path
// exports.updateCareerPath = async (req, res) => {
//   try {
//     const updated = await CareerPath.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updated) return res.status(404).json({ error: "CareerPath not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid data", details: err.message });
//   }
// };

// // DELETE career path
// exports.deleteCareerPath = async (req, res) => {
//   try {
//     const deleted = await CareerPath.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "CareerPath not found" });
//     res.json({ message: "CareerPath deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

const CareerPath = require("../models/CareerPath");

// GET all career paths
exports.getCareerPaths = async (req, res) => {
  try {
    const paths = await CareerPath.find()
      .populate("courses.courseId", "title description imageurl trainer");

    const formattedPaths = paths.map((path) => {
      // Extract levels from the course array
      const levels = path.courses.map((c) => c.level);

      // Deduplicate + sort by importance
      const uniqueLevels = [...new Set(levels)];
      const levelOrder = ["Beginner", "Intermediate", "Advanced"];
      const sortedLevels = uniqueLevels.sort(
        (a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)
      );

      // Build readable range
      let levelSummary = "";
      if (sortedLevels.length === 1) {
        levelSummary = sortedLevels[0]; // only Beginner
      } else {
        // Beginner to Advanced, Beginner to Intermediate, etc.
        levelSummary = `${sortedLevels[0]} to ${sortedLevels[sortedLevels.length - 1]}`;
      }

      return {
        ...path.toObject(),
        levelSummary, // 👈 new field for frontend
      };
    });

    res.json({
      success: true,
      data: formattedPaths,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single career path by ID
exports.getCareerPathById = async (req, res) => {
  try {
    const path = await CareerPath.findById(req.params.id)
      .populate("courses.courseId", "title description imageurl trainer");

    if (!path) {
      return res.status(404).json({ error: "CareerPath not found" });
    }

    res.json({ success: true, data: path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create new career path
exports.createCareerPath = async (req, res) => {
  try {
    const newPath = new CareerPath(req.body);
    const saved = await newPath.save();
    res.status(201).json({ success: true, data: saved });
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
    }).populate("courses.courseId", "title");

    if (!updated) {
      return res.status(404).json({ error: "CareerPath not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
};

// DELETE career path
exports.deleteCareerPath = async (req, res) => {
  try {
    const deleted = await CareerPath.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "CareerPath not found" });
    }
    res.json({ success: true, message: "CareerPath deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
