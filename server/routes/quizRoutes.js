const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Get All Quizzes"));
router.get("/:id", (req, res) => res.send(`Get Quiz by ID ${req.params.id}`));
router.post("/", (req, res) => res.send("Add Quiz"));
router.put("/:id", (req, res) => res.send(`Update Quiz with ID ${req.params.id}`));
router.delete("/:id", (req, res) => res.send(`Delete Quiz with ID ${req.params.id}`));

module.exports = router;
