const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Imageurl: {
    type: String,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Learner",
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
  },
  admin:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  role: {
    type: Number,
    default: 0,  // 0 = User, 1 = Admin, etc.
  },
  flag: {
    type: Number,
    default: 0,  // Active or inactive user
  },
}, { timestamps: true, versionKey: false });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    return next();
    //this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Match password method
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
