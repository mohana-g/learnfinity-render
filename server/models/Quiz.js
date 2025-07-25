const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      answer: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
    },
  ],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
}, 
{
  timestamps: true, versionKey: false,
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
