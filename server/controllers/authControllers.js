const pool = require("../config/db");

const jwt = require('jsonwebtoken');
//const emailjs = require("@emailjs/nodejs");
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Learner = require('../models/Learner');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// //Admin Login Logic
// const adminLogin = async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res.status(400).json({ error: 'Email, password, and role are required' });
//   }

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     if (role !== 'admin') {
//       return res.status(400).json({ error: 'Invalid role' });
//     }

//     const isMatch = await admin.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Check if the user already exists in the User collection, if not create one
//     let user = await User.findOne({ email, role: 1 }); // Role 1 for Admin
//     //Old code for admin without hashing password in user collection
//     // if (!user) {
//     //   user = new User({
//     //     email,
//     //     password, // You can hash the password or use a default one if needed
//     //     role: 1,  // Admin role
//     //   });
//     //   await user.save();
//     // }

//     //new code for hashing password in user collection for admin--3/9/25
//     if (!user) {
//       const hashedPassword = await bcrypt.hash(password, 10); // hash plain password
//       user = new User({
//         email,
//         password: hashedPassword,
//         role: 1,
//         admin: admin._id, // Link to the Admin document
//       });
//       await user.save();
//     }

//     const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

//     return res.status(200).json({ success: true, token });
//   } catch (err) {
//     console.error('Error during admin login:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

//Try new code for admin login to hash password in admin collection and use same in user collection
// Admin Login (Postgres equivalent of MongoDB code)
const adminLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    // 🔎 Find admin
    const { rows: admins } = await pool.query("SELECT * FROM admin WHERE email=$1", [email]);
    if (admins.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    let admin = admins[0];

    // 🚫 Role check
    if (role !== "admin") {
      return res.status(400).json({ error: "Invalid role" });
    }

    let isMatch = false;
    let hashedPasswordToUse = admin.password;

    // ✅ Check if the admin password is already hashed
    if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      // plain text, compare directly
      if (admin.password === password) {
        isMatch = true;

        // 🔒 Hash once and update admin in DB
        hashedPasswordToUse = await bcrypt.hash(password, 10);
        await pool.query("UPDATE admin SET password=$1 WHERE id=$2", [
          hashedPasswordToUse,
          admin.id,
        ]);
        admin.password = hashedPasswordToUse;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Now use the SAME hashed password for User
    const { rows: users } = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND role=1",
      [email]
    );

    if (users.length === 0) {
      // User doesn’t exist, create new
      await pool.query(
        `INSERT INTO users (email, password, role, admin_id, created_at)
         VALUES ($1, $2, 1, $3, NOW())`,
        [email, hashedPasswordToUse, admin.id]
      );
    } else {
      // ensure sync if password differs
      if (users[0].password !== hashedPasswordToUse) {
        await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
          hashedPasswordToUse,
          users[0].id,
        ]);
      }
    }

    // 🎫 Generate JWT
    const token = jwt.sign({ id: admin.id, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error during admin login:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//Learner Login Logic
// Learner Login (Postgres — exact logic match to your MongoDB version)
const learnerLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  try {
    // Find learner by email
    const { rows: learners } = await pool.query("SELECT * FROM learner WHERE email = $1", [email]);
    if (learners.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const learner = learners[0];

    // Check role
    if (role !== "learner") {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if learner is blocked
    if (learner.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    // Correct password comparison (learner.password is expected to be hashed)
    const isMatch = await bcrypt.compare(password, learner.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user exists in `users` table for role = 0 (Learner)
    const { rows: users } = await pool.query("SELECT * FROM users WHERE email = $1 AND role = 0", [email]);
    const user = users[0];

    // If user exists in users table and is blocked there, block the login
    if (user && user.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    // If user doesn't exist in users table, create one (use the already hashed password)
    if (!user) {
      await pool.query(
        "INSERT INTO users (email, password, role, learner_id, created_at) VALUES ($1, $2, 0, $3, NOW())",
        [email, learner.password, learner.id]
      );
    }

    // Generate JWT token (using learner.id and learner.role just like Mongo version used learner._id and learner.role)
    const token = jwt.sign({ id: learner.id, role: learner.role }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error during learner login:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Trainer Login Logic
// Trainer Login (Postgres — exact logic match to your MongoDB version)
const trainerLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    // Find trainer by email
    const { rows: trainers } = await pool.query(
      "SELECT * FROM trainer WHERE email = $1",
      [email]
    );

    if (trainers.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const trainer = trainers[0];

    // Check role
    if (role !== 'trainer') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if trainer is blocked
    if (trainer.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    // Password check (assuming trainer.password is hashed with bcrypt)
    // This mirrors trainer.matchPassword(...) from Mongoose
    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user exists in `users` table with role = 2 (Trainer)
    const { rows: users } = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = 2",
      [email]
    );
    const user = users[0];

    // If user exists in users table and is blocked there, block the login
    if (user && user.flag === 1) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    // If user doesn't exist in users table, create one (use trainer's password as stored)
    if (!user) {
      await pool.query(
        "INSERT INTO users (email, password, role, created_at) VALUES ($1, $2, 2, NOW())",
        [email, trainer.password]
      );
    }

    // Generate JWT token (using trainer.id and trainer.role like Mongo used trainer._id and trainer.role)
    const token = jwt.sign(
      { id: trainer.id, role: trainer.role ?? 'trainer' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

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
// Reset Password (Postgres version matching MongoDB logic)
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Decode email from token
    const email = Buffer.from(token, "base64").toString("utf-8").toLowerCase();

    // Try finding user in Admin, Learner, Trainer
    let { rows: admins } = await pool.query("SELECT * FROM admin WHERE email=$1", [email]);
    let { rows: learners } = await pool.query("SELECT * FROM learner WHERE email=$1", [email]);
    let { rows: trainers } = await pool.query("SELECT * FROM trainer WHERE email=$1", [email]);

    let user = admins[0] || learners[0] || trainers[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset link" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update in the right table
    if (admins[0]) {
      await pool.query("UPDATE admin SET password=$1 WHERE email=$2", [hashedPassword, email]);
    } else if (learners[0]) {
      await pool.query("UPDATE learner SET password=$1 WHERE email=$2", [hashedPassword, email]);
    } else if (trainers[0]) {
      await pool.query("UPDATE trainer SET password=$1 WHERE email=$2", [hashedPassword, email]);
    }

    // Also update in users table
    await pool.query("UPDATE users SET password=$1 WHERE email=$2", [hashedPassword, email]);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Server error" });
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
    // Look up user in Postgres (equivalent to User.findOne({ email }))
    const { rows: users } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Blocked user check
    if (user.flag === 1) {
      return res.status(403).json({ message: "Your account has been blocked by the admin." });
    }

    // Map numeric role to role name
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
    const token = jwt.sign(
      { id: user.id, role: roleName }, // user._id in Mongo → user.id in Postgres
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ role: roleName, token });
  } catch (error) {
    console.error("Role check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { adminLogin, learnerLogin, trainerLogin, resetPassword, checkUserRole };