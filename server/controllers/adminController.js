/*const User = require('../models/User');
const Course = require('../models/Course');
const Trainer = require('../models/Trainer');

// Fetch all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Block user
const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.flag = 1; // Blocked
        await user.save();
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch pending Trainers
const getPendingTrainers = async (req, res) => {
    try {
        const Trainers = await Trainer.find({ flag: 0 });
        res.json(Trainers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve Trainer
const approveTrainer = async (req, res) => {
    try {
        const Trainer = await Trainer.findById(req.params.id);
        Trainer.flag = 1; // Approved
        await Trainer.save();
        res.json({ message: 'Trainer approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Decline Trainer
const declineTrainer = async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer declined successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, blockUser, deleteUser, getCourses, deleteCourse, getPendingTrainers, approveTrainer, declineTrainer };
*/


const User = require("../models/User");
const Learner = require("../models/Learner");
const Trainer = require("../models/Trainer");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Review = require("../models/Review");


// Get All Users (Learners & Trainers)
/*const getUsers = async (req, res) => {
  try {
    const Learners = await Learner.find({}, "firstName lastName email phone dob profileImage").lean();
    const Trainers = await Trainer.find({}, "fullName email phoneNumber institute profileImage").lean();

    const formattedLearners = Learners.map(Learner => ({
      _id: Learner._id,
      name: `${Learner.firstName} ${Learner.lastName}`,
      email: Learner.email,
      phone: Learner.phone,
      dob: Learner.dob,
      role: "Learner",
      profileImage: Learner.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    }));

    const formattedTrainers = Trainers.map(Trainer => ({
      _id: Trainer._id,
      name: Trainer.fullName,
      email: Trainer.email,
      phone: Trainer.phoneNumber,
      institute: Trainer.institute,
      role: "Trainer",
      profileImage: Trainer.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    }));

    res.json({ users: [...formattedLearners, ...formattedTrainers] });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};*/

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "email flag role createdAt")
        .populate("learner", "dob phone firstName lastName") // Fetch DOB & Phone from Learner schema
        .populate("trainer", "institute phoneNumber fullName") // Fetch Institute & Phone from Trainer schema
        .lean(); // Fetch actual users
      res.json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// Block User
const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.flag = 1; // Set flag to 1 (blocked)
        await user.save();
        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//unblock user
const unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.flag = 0; // Set flag to 0 (unblocked)
        await user.save();
        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove associated Learner/Trainer document if exists
        if (user.learner) {
            await Learner.findByIdAndDelete(user.learner);
        }
        if (user.trainer) {
            await Trainer.findByIdAndDelete(user.trainer);
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Pending Trainers
const getPendingTrainers = async (req, res) => {
    try {
      const trainers = await Trainer.find({ flag: 0 }, "fullName email phoneNumber institute profileImage");
      res.json({ trainers });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// Approve Trainer
const approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    trainer.flag = 2;
    await trainer.save();

    res.json({ message: "Trainer approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Decline Trainer
/*const declineTrainer = async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ message: "Trainer declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};*/

// Decline Trainer (Set flag to 2 instead of deleting)
const declineTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    trainer.flag = 3;  // Mark as declined
    await trainer.save();

    res.json({ message: "Trainer declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all approved Trainers
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ flag: 2 }); // Only approved Trainers
    //console.log("Fetched Trainers:", Trainers); // Debugging log
    res.json({ trainers });
  } catch (error) {
    //console.error("Error fetching Trainers:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
/*
// Add Course (Ensures Trainer is Valid)
const addCourse = async (req, res) => {
  try {
    const { title, description, TrainerId } = req.body;

    const Trainer = await Trainer.findById(TrainerId);
    if (!Trainer) return res.status(400).json({ message: "Invalid Trainer ID" });

    const newCourse = new Course({ title, description, TrainerId });
    await newCourse.save();

    res.json({ message: "Course added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
*/
//new add course
const addCourse = async (req, res) => {
  try {
    const { title, name, description, instructorName, trainerId } = req.body;

    // Validate required fields
    if (!title || !name || !trainerId) {
      return res.status(400).json({ message: "Title, name, and TrainerId are required" });
    }

    // Check if Trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(400).json({ message: "Invalid Trainer ID" });

    // Get uploaded image
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new course
    const newCourse = new Course({
      title,
      name,
      description,
      instructorName,
      trainer: trainerId, // Store Trainer ID
      imageurl: imagePath
    });

    // Save course
    await newCourse.save();

    // Add course to Trainer's courses array
    trainer.courses.push(newCourse._id);
    await trainer.save();

    res.status(201).json({ success: true, message: "Course added successfully!", course: newCourse });

  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Find the assigned Trainer
    const trainer = await Trainer.findById(course.trainer);
    if (trainer) {
      // Remove course ID from Trainer's courses array
      trainer.courses = trainer.courses.filter(course => course.toString() !== courseId);
      await trainer.save();
    }

    // Find all chapters linked to the course
    const chapters = await Chapter.find({ course: courseId });

    // Collect all lesson IDs from the chapters
    const lessonIds = chapters.flatMap((chapter) => chapter.lessons);

    // Delete lessons associated with these chapters
    await Lesson.deleteMany({ _id: { $in: lessonIds } });

    // Delete all chapters related to the course
    await Chapter.deleteMany({ course: courseId });

    // Delete quizzes and reviews
    await Quiz.deleteMany({ course: courseId });
    await Review.deleteMany({ courseId });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });

  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Learners Progress
const getLearnersProgress = async (req, res) => {
  try {
    const learners = await Learner.find()
      .populate({
        path: 'courses',
        populate: [
          { path: 'chapters', populate: { path: 'lessons' } },
          { path: 'quizzes' }
        ]
      })
      .populate({
        path: 'quizzes.quiz',
        model: 'Quiz'
      })
      .populate('completedLessons');

    const learnerProgressData = learners.map((learner) => {
      const enrolledCourses = learner.courses.map((course) => {
        // Total lessons count
        const totalLessons = course.chapters.reduce((lessonCount, chapter) => {
          return lessonCount + (chapter.lessons ? chapter.lessons.length : 0);
        }, 0);

        // Flatten lesson IDs for the course
        const courseLessonIds = course.chapters.flatMap(chapter =>
          chapter.lessons.map(lesson => lesson._id.toString())
        );

        // Completed lessons count
        const completedLessonsCount = Array.isArray(learner.completedLessons)
        ? learner.completedLessons.filter(lesson =>
            courseLessonIds.includes(lesson._id.toString())
          ).length
        : 0;

        // Completed quizzes count
        const completedQuizzesCount = Array.isArray(learner.quizzes)
          ? learner.quizzes.filter(sq =>
              sq.course && sq.course.toString() === course._id.toString()
            ).length
          : 0;

        const totalQuizzes = course.quizzes.length;
        const totalItems = totalLessons + totalQuizzes;
        const completedItems = completedLessonsCount + completedQuizzesCount;

        let progressPercent = 0;
        if (totalItems > 0) {
          progressPercent = ((completedItems / totalItems) * 100).toFixed(0);
        }

        return {
          courseTitle: course.title,
          totalChapters: course.chapters.length,
          totalLessons,
          completedLessons: completedLessonsCount,
          totalQuizzes,
          completedQuizzes: completedQuizzesCount,
          progressPercent
        };
      });

      return {
        _id: learner._id,
        firstName: learner.firstName,
        lastName: learner.lastName,
        email: learner.email,
        enrolledCourses
      };
    });

    res.status(200).json(learnerProgressData);
  } catch (error) {
    console.error('Error fetching Learner progress:', error);
    res.status(500).json({ error: 'An error occurred while fetching Learner progress' });
  }
};

module.exports = {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getPendingTrainers,
  approveTrainer,
  declineTrainer,
  getTrainers,
  getCourses,
  addCourse,
  deleteCourse,
  getLearnersProgress
};
