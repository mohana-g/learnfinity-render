const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for Trainer
const trainerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensure phone number is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], // Gender can be one of these
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    flag: {
      type: Number,
      default: 0, // Default flag value 0 = pending, 2 = approved, 3 = declined
    },
  },
  { timestamps: true , versionKey: false } // Automatically create createdAt and updatedAt fields
);

// Hash password before saving to DB
trainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  //console.log("Before Hashing:", this.password); // Check raw password
  //const salt = await bcrypt.genSalt(10);
  //this.password = await bcrypt.hash(this.password, salt);
  //console.log("After Hashing:", this.password); // Check hashed password
  next();
});

// Method to compare passwords for Trainer
trainerSchema.methods.matchPassword = async function (enteredPassword) {
  //console.log("Entered Password:", enteredPassword);
  //console.log("Stored Hashed Password:", this.password);

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  //console.log("Password Match Result:", isMatch);

  return isMatch;
};


module.exports = mongoose.model('Trainer', trainerSchema);
