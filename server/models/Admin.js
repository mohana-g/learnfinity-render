const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'trainer', 'learner'],
      default: 'admin',
    },
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
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  //console.log("Before Hashing:", this.password); // Check raw password
  //const salt = await bcrypt.genSalt(10);
  //this.password = await bcrypt.hash(this.password, salt);
  //console.log("After Hashing:", this.password); // Check hashed password
  next();
});

// Method to compare passwords for Admin
adminSchema.methods.matchPassword = async function (enteredPassword) {
  //console.log("Entered Password:", enteredPassword);
  //console.log("Stored Hashed Password:", this.password);

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  //console.log("Password Match Result:", isMatch);

  return isMatch;
};


module.exports = mongoose.model('Admin', adminSchema);
