const mongoose = require("mongoose");

const careerPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    levels: {
      type: String, // e.g., "Foundation → Intermediate → Advanced"
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // Link to existing Course schema
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("CareerPath", careerPathSchema);
