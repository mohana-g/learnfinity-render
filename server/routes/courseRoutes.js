const express = require("express");
const router = express.Router();
const { getAllCourses, getCourseById, addCourse, getPopularCourses, updateCourse,
     uploadChaptersAndLessons, getChaptersByCourse ,removeChapter, removeLesson, addQuiz, getQuizByCourse, deleteQuiz,
      fetchCourseDetails, enrollCourse } = require("../controllers/courseController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get popular courses
router.get("/popular", getPopularCourses);

// ✅ Route to get all courses
router.get("/", getAllCourses);

// ✅ Route to get a single course by ID
router.get("/:courseId", getCourseById); // ✅ Now matches frontend

// ✅ Route to add a new course (Only for approved Trainers)
router.post("/", addCourse);

// ✅ Update Course (with optional image upload)
router.put("/:courseId", upload.single("image"), updateCourse);

// Route to upload chapters and lessons
router.post("/upload", upload.array("videos"), uploadChaptersAndLessons);

// ✅ Route to get chapters by course ID
router.get('/:courseId/chapters', getChaptersByCourse);

// Route to remove a chapter
router.delete('/:courseId/chapters/:chapterId', removeChapter);

// Route to remove a lesson
router.delete('/:courseId/chapters/:chapterId/lessons/:lessonId', removeLesson);

// Add quiz to a course
router.post('/:courseId/add-quiz', addQuiz);

// Get quiz by course ID
router.get('/:courseId/get-quiz', getQuizByCourse);

// Delete quiz
router.delete('/:courseId/delete-quiz', deleteQuiz);

// Route to get course details by ID
router.get("/course-details/:courseId", fetchCourseDetails);

// Route to enroll in a course
router.post("/course-details/:courseId/enroll", authMiddleware ,enrollCourse);

// ✅ Export Router
module.exports = router;
