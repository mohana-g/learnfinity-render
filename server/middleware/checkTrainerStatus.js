const Trainer = require("../models/Trainer");

const checkTrainerStatus = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    if (trainer.flag === 3) {
      return res.status(403).json({ message: "Access denied. Your account has been declined." });
    }

    req.trainer = trainer; // Store Trainer data for later use
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = checkTrainerStatus;
