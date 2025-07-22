const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Get All Chapters"));
router.get("/:id", (req, res) => res.send(`Get Chapter by ID ${req.params.id}`));
router.post("/", (req, res) => res.send("Add Chapter"));
router.put("/:id", (req, res) => res.send(`Update Chapter with ID ${req.params.id}`));
router.delete("/:id", (req, res) => res.send(`Delete Chapter with ID ${req.params.id}`));

module.exports = router;
