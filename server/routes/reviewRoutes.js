const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Get All Reviews"));
router.get("/:id", (req, res) => res.send(`Get Review by ID ${req.params.id}`));
router.post("/", (req, res) => res.send("Add Review"));
router.put("/:id", (req, res) => res.send(`Update Review with ID ${req.params.id}`));
router.delete("/:id", (req, res) => res.send(`Delete Review with ID ${req.params.id}`));

module.exports = router;
