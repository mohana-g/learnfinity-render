const express = require("express");
const router = express.Router();
const careerPathController = require("../controllers/careerPathController");

router.get("/", careerPathController.getCareerPaths); // All career paths
router.get("/:id", careerPathController.getCareerPathById); // Single path details

module.exports = router;
