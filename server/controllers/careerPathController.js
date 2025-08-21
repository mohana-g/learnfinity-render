const CareerPath = require("../models/CareerPath");

exports.getCareerPaths = async (req, res) => {
  try {
    const paths = await CareerPath.find().populate("courses", "title imageurl instructorName");
    res.status(200).json({ data: paths });
  } catch (err) {
    res.status(500).json({ message: "Error fetching career paths" });
  }
};

exports.getCareerPathById = async (req, res) => {
  try {
    const path = await CareerPath.findById(req.params.id)
      .populate({
        path: "courses",
        select: "title description imageurl instructorName",
      });

    if (!path) {
      return res.status(404).json({ message: "Career path not found" });
    }
    res.status(200).json({ data: path });
  } catch (err) {
    res.status(500).json({ message: "Error fetching career path details" });
  }
};
