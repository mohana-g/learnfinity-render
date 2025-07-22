const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Get All Lessons"));
router.get("/:id", (req, res) => res.send(`Get Lesson by ID ${req.params.id}`));
router.post("/", (req, res) => res.send("Add Lesson"));
router.put("/:id", (req, res) => res.send(`Update Lesson with ID ${req.params.id}`));
router.delete("/:id", (req, res) => res.send(`Delete Lesson with ID ${req.params.id}`));

module.exports = router;
