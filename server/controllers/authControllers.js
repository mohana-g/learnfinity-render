
const jwt = require('jsonwebtoken');
//const emailjs = require("@emailjs/nodejs");
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Learner = require('../models/Learner');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

//Admin Login Logic
const adminLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (role !== 'admin') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the user already exists in the User collection, if not create one
    let user = await User.findOne({ email, role: 1 }); // Role 1 for Admin
    //Old code for admin without hashing password in user collection
    // if (!user) {
    //   user = new User({
    //     email,
    //     password, // You can hash the password or use a default one if needed
    //     role: 1,  // Admin role
    //   });
    //   await user.save();
    // }

    //new code for hashing password in user collection for admin--3/9/25
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10); // hash plain password
      user = new User({
        email,
        password: hashedPassword,
        role: 1,
        admin: admin._id, // Link to the Admin document
      });
      await user.save();
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Error during admin login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//Learner Login Logic
const learnerLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    // Find learner by email
    const learner = await Learner.findOne({ email });
    if (!learner) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check role
    if (role !== "learner") {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if learner is blocked
    if (learner.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }


    // Debugging logs
    //console.log("Stored Hashed Password:", learner.password);
    //console.log("Entered Password:", password);
    
    // Correct password comparison
    const isMatch = await bcrypt.compare(password, learner.password);
    //console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user exists in `User` collection
    let user = await User.findOne({ email, role: 0 }); // Role 0 for Learner

    // Check if the user is blocked in the User collection
    if (user && user.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    if (!user) {
      user = new User({
        email,
        password, // Use the already hashed password
        role: 0, // Learner role
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: learner._id, role: learner.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ success: true, token });

  } catch (err) {
    console.error("Error during learner login:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Trainer Login Logic
const trainerLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    if (role !== 'trainer') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if learner is blocked
    if (trainer.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }


    const isMatch = await trainer.matchPassword(password);  // Assuming the matchPassword method exists on Trainer model
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the user already exists in the User collection, if not create one
    let user = await User.findOne({ email, role: 2 }); // Role 2 for Trainer


    // Check if the user is blocked in the User collection
    if (user && user.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    if (!user) {
      user = new User({
        email,
        password, // You can hash the password or use a default one if needed
        role: 2,  // Trainer role
      });
      await user.save();
    }

    const token = jwt.sign({ id: trainer._id, role: trainer.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Error during trainer login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
/*
// Forgot Password Logic (with EmailJS)
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found with this email' });
    }

    // Create reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Generate the reset link
    const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}`;

    // Prepare data to send through EmailJS
    const emailData = {
      to_email: email,
      reset_link: resetLink, // The reset link to be included in the email
    };

    console.log(process.env.EMAILJS_PUBLIC_KEY);

    // Send the email using EmailJS
    await emailjs.send(
      //process.env.EMAILJS_SERVICE_ID, 
      //process.env.EMAILJS_TEMPLATE_ID, 
      "service_jtatsrq",
      "template_3hj5rro",
      "Test",
      //emailData,
      "8TOkSAnsc4yfF81je"
      //process.env.EMAILJS_PUBLIC_KEY
    );

    return res.status(200).json({
      message: 'Password reset link sent successfully. Check your email.',
    });
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return res.status(500).json({ error: 'Error sending reset email. Try again later.' });
  }
};


// Reset Password Logic (using the JWT reset token)
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'New password and confirm password are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error during password reset:', err);
    return res.status(500).json({ error: 'Error resetting password. Try again later.' });
  }
};
*/
// Reset Password Logic
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Decode email from the token
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Find user in Admin, Learner, Trainer collections
    let user = await Admin.findOne({ email }) || 
               await Learner.findOne({ email }) || 
               await Trainer.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Also update in User collection
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// // Dynamic Role Check for Microsoft Login
// const checkUserRole = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   try {
//     let user, role;

//     // Check if email exists in Admin
//     user = await Admin.findOne({ email });
//     if (user) {
//       const token = jwt.sign({ id: user._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ role: 'admin', token });
//     }

//     // Check in Trainer
//     user = await Trainer.findOne({ email });
//     if (user) {
//       const token = jwt.sign({ id: user._id, role: 'trainer' }, JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ role: 'trainer', token });
//     }

//     // Check in Learner
//     user = await Learner.findOne({ email });
//     if (user) {
//       // If learner is blocked
//       if (user.flag === 1) {
//         return res.status(403).json({ error: 'Your account has been blocked by the admin.' });
//       }

//       const token = jwt.sign({ id: user._id, role: 'learner' }, JWT_SECRET, { expiresIn: '1h' });
//       return res.json({ role: 'learner', token });
//     }

//     return res.status(404).json({ error: 'User not found' });
//   } catch (err) {
//     console.error('Error checking user role:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };


// Dynamic Role Check for Microsoft Login

const checkUserRole = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Blocked user check
    if (user.flag === 1) {
      return res.status(403).json({ message: "Your account has been blocked by the admin." });
    }

    let roleName;
    switch (user.role) {
      case 0:
        roleName = "learner";
        break;
      case 1:
        roleName = "admin";
        break;
      case 2:
        roleName = "trainer";
        break;
      default:
        roleName = "unknown";
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: roleName }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ role: roleName, token });
  } catch (error) {
    console.error("Role check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { adminLogin, learnerLogin, trainerLogin, resetPassword, checkUserRole };