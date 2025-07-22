const cron = require("node-cron");
const Trainer = require("../models/Trainer"); // Import your Trainer model

// Function to delete old declined Trainers (older than 30 days)
const cleanUpDeclinedTrainers = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 days back

    const deletedTrainers = await Trainer.deleteMany({
      flag: 3, // Declined Trainers
      updatedAt: { $lt: thirtyDaysAgo }, // Older than 30 days
    });

    console.log(`Cleanup completed: ${deletedTrainers.deletedCount} trainers removed.`);
  } catch (error) {
    console.error("Error cleaning up declined trainers:", error);
  }
};

// Schedule cleanup to run every day at midnight (00:00)
cron.schedule("0 0 * * *", cleanUpDeclinedTrainers);

module.exports = { cleanUpDeclinedTrainers };
