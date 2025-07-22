const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageurl: {
      type: String,
    },
    instructorName: {
      type: String,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    learners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Learner",
      },
    ],
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    reviews: [
      {
        learnerName: String, // Store Learner's name instead of ObjectId
        comment: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Course", courseSchema);


