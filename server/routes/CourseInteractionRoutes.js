// Backend: routes/CourseInteractionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getEnrolledCourses, markLessonComplete, getQuiz, submitQuizAttempt, submitReview, downloadCertificate, getTestimonials } = require('../controllers/CourseInteractionController');

//get course
router.get('/:courseId', authMiddleware, getEnrolledCourses);

//completed lesson updates
router.put('/complete-lesson', authMiddleware, markLessonComplete);

//Attempt quiz
router.get('/quiz/:courseId', authMiddleware, getQuiz);

//submit quiz attempt
router.post('/submit-quiz', authMiddleware, submitQuizAttempt);

//Route to submit a review
router.post('/submit-review', authMiddleware, submitReview);

//Route to get testimonials
router.get('/testimonials', getTestimonials);

//Route to download certificate
router.get('/download-certificate/:courseId', authMiddleware, downloadCertificate);

module.exports = router;

