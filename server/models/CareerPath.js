const mongoose = require("mongoose");

const careerPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
    },
    description: {
      type: String,
    },
    levels: [
      {
        name: String, // Foundation, Intermediate, Advanced
        roles: [String], // Array of role names
        skills: [String], // Array of skills
        courses: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course", // Links to your Course model
          },
        ],
      },
    ],
    softSkills: [String], // e.g. ["Problem-Solving", "Collaboration"]
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("CareerPath", careerPathSchema);
