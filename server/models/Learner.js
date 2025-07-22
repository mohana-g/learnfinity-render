// models/Learner.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const learnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    quizzes: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        chapter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chapter',
        },
        quiz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Quiz',
        },
        marksScored: {
          type: Number,
        },
        totalMarks: {
          type: Number,
        },
      },
    ],
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Hash password before saving to DB
learnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  //console.log("Before Hashing:", this.password); // Check raw password
  //const salt = await bcrypt.genSalt(10);
  //this.password = await bcrypt.hash(this.password, salt);
  //console.log("After Hashing:", this.password); // Check hashed password

  next();
});

// Method to compare passwords
learnerSchema.methods.matchPassword = async function (enteredPassword) {
  //console.log("Entered Password:", enteredPassword);
  //console.log("Stored Hashed Password:", this.password);

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  //console.log("Password Match Result:", isMatch);

  return isMatch;
};


module.exports = mongoose.model('Learner', learnerSchema);
