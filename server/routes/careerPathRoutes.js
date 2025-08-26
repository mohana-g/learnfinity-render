// const express = require("express");
// const router = express.Router();
// const careerPathController = require("../controllers/careerPathController");

// router.get("/", careerPathController.getCareerPaths); // All career paths
// router.get("/:id", careerPathController.getCareerPathById); // Single path details

// module.exports = router;


//correct old code
// const express = require("express");
// const router = express.Router();
// const careerPathController = require("../controllers/careerPathController");

// // CareerPath routes
// router.get("/", careerPathController.getCareerPaths);
// router.post("/", careerPathController.createCareerPath);
// router.put("/:id", careerPathController.updateCareerPath);
// router.delete("/:id", careerPathController.deleteCareerPath);

// module.exports = router;


const express = require("express");
const router = express.Router();
const careerPathController = require("../controllers/careerPathController");

// CareerPath routes
router.get("/", careerPathController.getCareerPaths);
router.get("/:id", careerPathController.getCareerPathById);
router.post("/", careerPathController.createCareerPath);
router.put("/:id", careerPathController.updateCareerPath);
router.delete("/:id", careerPathController.deleteCareerPath);

module.exports = router;
