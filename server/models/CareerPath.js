// const mongoose = require("mongoose");

// const careerPathSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     domain: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     levels: [
//       {
//         name: String, // Foundation, Intermediate, Advanced
//         roles: [String], // Array of role names
//         skills: [String], // Array of skills
//         courses: [
//           {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Course", // Links to your Course model
//           },
//         ],
//       },
//     ],
//     softSkills: [String], // e.g. ["Problem-Solving", "Collaboration"]
//   },
//   { timestamps: true, versionKey: false }
// );

// module.exports = mongoose.model("CareerPath", careerPathSchema);

const mongoose = require("mongoose");

const CourseRefSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // reference to your existing Course schema
    required: true,
  },
  level: { type: String, required: true },
  duration: { type: String, required: true },
  skillsLearnt: [{ type: String, required: true }],
});

const CareerPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    roles: [{ type: String, required: true }],
    courses: [CourseRefSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerPath", CareerPathSchema);
