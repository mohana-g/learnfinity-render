const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
},
{
  timestamps: true, versionKey: false,
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;


//If we need description for future , use this commented code
/*
  description: {
    type: String,
  },
*/
