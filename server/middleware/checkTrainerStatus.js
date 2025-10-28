const pool = require("../config/db");

const Trainer = require("../models/Trainer");

const checkTrainerStatus = async (req, res, next) => {
  try {
    const trainerId = req.user.id;

    // Fetch trainer from PostgreSQL
    const trainerRes = await pool.query(
      `SELECT * FROM trainer WHERE id = $1`,
      [trainerId]
    );

    if (trainerRes.rows.length === 0) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const trainer = trainerRes.rows[0];

    // Check the flag
    if (trainer.flag === 3) {
      return res.status(403).json({ message: "Access denied. Your account has been declined." });
    }

    req.trainer = trainer; // Store trainer data for later use
    next();
  } catch (error) {
    console.error("Error checking trainer status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = checkTrainerStatus;
