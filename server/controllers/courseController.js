const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Lesson = require("../models/Lesson");
const Trainer = require("../models/Trainer");
const Learner = require("../models/Learner");
const Quiz = require("../models/Quiz");
const Review = require("../models/Review");
const mongoose = require('mongoose');


// ✅ Add Course - Only for Approved Trainers (flag: 2)
const addCourse = async (req, res) => {
  try {
    const { title, name, description } = req.body;
    const trainerId = req.user.id; // Assuming JWT authentication provides `user.id`

    // Find the Trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    // Check if the Trainer is approved
    if (trainer.flag !== 2) {
      return res.status(403).json({ success: false, message: "Access denied. Approval required." });
    }

    // Create and save new course
    const newCourse = await Course.create({
      title,
      name,
      description,
      trainer: trainerId,
    });

    res.status(201).json({ success: true, message: "Course added successfully!", course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("trainer", "fullName");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses", error });
  }
};

// ✅ Get a Single Course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("trainer", "fullName");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✅ Get Popular Courses (Sorted by Enrolled Learners)---------THIS CODE IS NOT WORKING CORRECTLY
/*const getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("Trainer", "fullName")
      .sort({ Learners: -1 }) // Sort by number of enrolled Learners
      .limit(4); // Limit to 4 popular courses

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    res.status(500).json({ success: false, message: "Error fetching popular courses", error });
  }
};
*/
// ✅ Get Popular Courses (Sorted by Enrolled Learners)---------WORKING CODE
const getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $addFields: {
          learnerCount: { $size: "$learners" } // Count number of Learners
        }
      },
      { $sort: { learnerCount: -1 } }, // Sort by Learner count (descending)
      { $limit: 4 }, // Limit to 4 popular courses
      {
        $lookup: {
          from: "trainers", // Collection name in MongoDB
          localField: "trainer",
          foreignField: "_id",
          as: "trainer"
        }
      },
      { $unwind: "$trainer" }, // Unwind to access Trainer details
      {
        $project: {
          title: 1,
          name: 1,
          description: 1,
          learnerCount: 1,
          "trainer.fullName": 1,
          "trainer.email": 1,
          "trainer.institute": 1,
          "trainer.phoneNumber": 1,
          imageurl: 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    res.status(500).json({ success: false, message: "Error fetching popular courses", error });
  }
};

// ✅ Update Course
const updateCourse = async (req, res) => {
  try {
    const { title, name, description } = req.body;
    const updatedCourse = { title, name, description };

    if (req.file) {
      updatedCourse.imageurl = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(req.params.courseId, updatedCourse, { new: true });

    if (!course) return res.status(404).json({ error: "Course not found" });
    
    res.json({ message: "Course updated successfully!", data: course });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ Upload Chapters and Lessons
const uploadChaptersAndLessons = async (req, res) => {
  try {
    const { courseId, chapters } = req.body;
    const parsedChapters = JSON.parse(chapters);
    const uploadedVideos = req.files; // Get uploaded files from multer

    const chapterIds = []; // To store new and updated chapter IDs

    for (const chapter of parsedChapters) {
      let chapterDoc;

      // Update existing chapter or create new one
      if (chapter.chapterId) {
        chapterDoc = await Chapter.findById(chapter.chapterId);
        if (chapterDoc) {
          chapterDoc.name = chapter.chapterName || chapterDoc.name; // Update only if new data is provided
        }
      } else {
        chapterDoc = new Chapter({ course: courseId, name: chapter.chapterName });
        await chapterDoc.save();
      }

      chapterIds.push(chapterDoc._id); // Collect chapter IDs

      // Handle lessons
      for (const lesson of chapter.lessons) {
        let lessonDoc;
        const videoFile = uploadedVideos.find(file => file.originalname === lesson.videoUrl);

        if (lesson.lessonId) {
          lessonDoc = await Lesson.findById(lesson.lessonId);
          if (lessonDoc) {
            // Only update fields that have changed
            lessonDoc.number = lesson.number || lessonDoc.number;
            lessonDoc.title = lesson.title || lessonDoc.title;
            lessonDoc.description = lesson.description || lessonDoc.description;
            lessonDoc.videoUrl = videoFile ? videoFile.path : lessonDoc.videoUrl; // Only update if a new video is uploaded
            await lessonDoc.save();
          }
        } else {
          // Create new lesson
          lessonDoc = new Lesson({
            chapter: chapterDoc._id,
            number: lesson.number,
            title: lesson.title,
            description: lesson.description,
            videoUrl: videoFile ? videoFile.path : "",
          });
          await lessonDoc.save();
          chapterDoc.lessons.push(lessonDoc._id); // Add new lesson to chapter
        }
      }

      await chapterDoc.save(); // Save all updates
    }

    // Update course with all chapters
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { chapters: { $each: chapterIds } } // Ensure no duplicates
    });

    res.status(200).json({ message: "Chapters and lessons updated successfully!" });
  } catch (error) {
    console.error("Error uploading chapters and lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get existing chapters and lessons for a course
const getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const chapters = await Chapter.find({ course: courseId }).populate("lessons"); // Fetch lessons too
    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove a chapter and its lessons
const removeChapter = async (req, res) => {
  const { courseId, chapterId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(chapterId)) {
    return res.status(400).json({ message: 'Invalid course or chapter ID' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    await Course.findByIdAndUpdate(courseId, { $pull: { chapters: chapterId } });
    await Lesson.deleteMany({ chapter: chapterId });
    await Chapter.findByIdAndDelete(chapterId);

    res.status(200).json({ message: 'Chapter and its lessons removed successfully' });
  } catch (error) {
    console.error('Error removing chapter:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Remove a lesson
const removeLesson = async (req, res) => {
  const { chapterId, lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chapterId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
    return res.status(400).json({ message: 'Invalid chapter or lesson ID' });
  }

  try {
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    await Chapter.findByIdAndUpdate(chapterId, { $pull: { lessons: lessonId } });
    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({ message: 'Lesson removed successfully' });
  } catch (error) {
    console.error('Error removing lesson:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add or update quiz for a course
const addQuiz = async (req, res) => {
  const { courseId } = req.params;
  const { title, questions } = req.body;

  try {
    let quiz = await Quiz.findOne({ course: courseId });

    if (quiz) {
      // Update existing quiz
      quiz.title = title;
      quiz.questions = questions;
    } else {
      // Create new quiz
      quiz = new Quiz({
        title,
        questions,
        course: courseId,
      });

      // Add quiz ID to course's quizzes array
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { quizzes: quiz._id }, // Ensures quiz ID is added only once
      });
    }

    await quiz.save();
    res.status(200).json({ message: 'Quiz added successfully', quiz });
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ error: 'Failed to add quiz' });
  }
};

// Get quiz by course ID
const getQuizByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const quiz = await Quiz.findOne({ course: courseId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

// Delete quiz

const deleteQuiz = async (req, res) => {
  const { courseId } = req.params;
  try {
    // Delete the quiz associated with the course
    const deletedQuiz = await Quiz.findOneAndDelete({ course: new mongoose.Types.ObjectId(courseId) });

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove the quiz reference from the course's quizzes array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { quizzes: deletedQuiz._id },
    });

    res.status(200).json({ message: 'Quiz deleted successfully!' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz', error });
  }
};

// Fetch course details by ID
const fetchCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch course details with population
    const course = await Course.findById(courseId)
      .populate({
        path: "trainer",
        select: "fullName email institute phoneNumber"
      })
      .populate({
        path: "chapters",
        populate: {
          path: "lessons",
          select: "number title description"
        }
      })
      .populate({
        path: "quizzes",
        select: "title questions"
      })
      .populate({
        path: "learners",
        select: "firstName lastName email"
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Calculate lesson count
    const lessonCount = course.chapters?.reduce((total, chapter) => {
      return total + (chapter.lessons ? chapter.lessons.length : 0);
    }, 0) || 0;

    // Fetch reviews for the course
    const reviews = await Review.find({ courseId });

    // Calculate average rating and review count
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const reviewCount = reviews.length;

    // Combine course details with review data
    res.status(200).json({
      success: true,
      data: {
        ...course._doc,
        lessonCount,
        reviews,
        averageRating: averageRating.toFixed(1),
        reviewCount
      }
    });
  } catch (error) {
    console.error("Error fetching course details:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Enroll a Learner in a course
const enrollCourse = async (req, res) => {
  try {
    const learnerId = req.user.id; // Get from auth middleware
    const { courseId } = req.params;

    // Find course and Learner
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Check if Learner is already enrolled
    if (course.learners.includes(learnerId)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // Add Learner to course and course to Learner
    course.learners.push(learnerId);
    learner.courses.push(courseId);

    await course.save();
    await learner.save();

    res.status(200).json({ 
      message: "Successfully enrolled in the course", 
      course, 
      learner 
    }); 
  } catch (error) {
    console.error("Enrollment error:", error.message);
    res.status(500).json({ message: "Failed to enroll", error: error.message });
  }
};


// ✅ Export all controllers
module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  getPopularCourses,
  updateCourse,
  uploadChaptersAndLessons,
  getChaptersByCourse,
  removeLesson,
  removeChapter,
  addQuiz,
  getQuizByCourse,
  deleteQuiz,
  fetchCourseDetails,
  enrollCourse,
};

