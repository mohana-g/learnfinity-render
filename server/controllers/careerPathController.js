// controllers/careerPathController.js
const CareerPath = require("../models/CareerPath");
const Learner = require("../models/Learner");
const Course = require("../models/Course");
const Trainer = require("../models/Trainer");
const Chapter = require("../models/Chapter");
const Quiz = require("../models/Quiz");
const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");

exports.getCareerPaths = async (req, res) => {
  try {
    const paths = await CareerPath.find().populate({
      path: "levels.courses",
      select: "title imageurl name"
    });
    res.status(200).json({ data: paths });
  } catch (err) {
    console.error("CareerPath fetch error:", err);
    res.status(500).json({ message: "Error fetching career paths", error: err.message });
  }
};

exports.getCareerPathById = async (req, res) => {
  try {
    const path = await CareerPath.findById(req.params.id).populate({
      path: "levels.courses",
      select: "title description imageurl name"
    });

    if (!path) {
      return res.status(404).json({ message: "Career path not found" });
    }
    res.status(200).json({ data: path });
  } catch (err) {
    console.error("CareerPath by ID error:", err);
    res.status(500).json({ message: "Error fetching career path details", error: err.message });
  }
};

