/*// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: ["https://learnfinity-client.onrender.com"], // ✅ change this to your actual frontend URL
  credentials: true
}));
app.use(bodyParser.json());

// Debug environment variables
console.log("MongoDB URL:", process.env.MONGODB_URL);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

// Example API endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");


require("dotenv").config();
require("./services/cronJobs"); // Import to start cleanup job


// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const courseInteractionRoutes = require('./routes/CourseInteractionRoutes');


// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (for image uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/admin", adminRoutes); // Admin-related routes
app.use("/api/auth", authRoutes); // Authentication-related routes
app.use("/api/courses", courseRoutes); // Course-related routes
app.use("/api/learner", learnerRoutes); // Learner-related routes
app.use("/api/trainer", trainerRoutes); // Trainer-related routes
app.use("/api/chapters", chapterRoutes); // Chapter-related routes
app.use("/api/lessons", lessonRoutes); // Lesson-related routes
app.use("/api/quizzes", quizRoutes); // Quiz-related routes
app.use('/api/course-interaction', courseInteractionRoutes);

// ✅ Add this test route to verify the backend
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Use the client app
app.use(express.static(path.join(__dirname,"client/build")));

//Render client for any path
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, "client/build/index.html"))
);

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the Learnfinity Backend!");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

