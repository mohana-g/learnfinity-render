const mongoose = require('mongoose');
const Course = require('../models/Course');
const Learner = require('../models/Learner');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Chapter = require('../models/Chapter');
const Review = require('../models/Review');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

//Get course contents
const getEnrolledCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId)
      .populate({
        path: 'chapters',
        populate: {
          path: 'lessons',
          select: 'number title description videoUrl',
        }
      })
      .populate('trainer', 'fullName');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const learner = await Learner.findById(userId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    const isEnrolled = course.learners.some(learnerId => learnerId.toString() === userId);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'Access denied. Not enrolled.' });
    }

    res.status(200).json({
      ...course.toObject(),
      completedLessons: learner.completedLessons || [],
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

//Mark lesson comepleted in Learner database
const markLessonComplete = async (req, res) => {
  const { lessonId } = req.body;
  const learnerId = req.user?.id || req.user?._id;  // Ensure req.user exists

  if (!lessonId || !learnerId) {
    return res.status(400).json({ message: 'Lesson ID and Learner ID are required' });
  }

  try {
    const lesson = await Lesson.findById(lessonId).populate({
      path: 'chapter',
      populate: { path: 'course' }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!lesson.chapter || !lesson.chapter.course) {
      return res.status(404).json({ message: 'Lesson does not belong to a valid course' });
    }

    const courseId = lesson.chapter.course._id;

    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    if (!learner.courses.includes(courseId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    if (!learner.completedLessons.includes(lessonId)) {
      learner.completedLessons.push(lessonId);
      await learner.save();
    }

    res.status(200).json({ message: 'Lesson marked as complete' });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Attempt quiz
const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ course: courseId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Submit quiz attempt new
const submitQuizAttempt = async (req, res) => {
  const { quizId, courseId, chapterId, score, totalMarks } = req.body;
  const learnerId = req.user.id; // Assuming middleware provides the logged-in user's ID

  try {
    // Validate quiz existence
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update Learner's quiz record
    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    // Check if the quiz already exists in the Learner's record
    const existingQuiz = learner.quizzes.find(
    (q) => q.quiz && q.quiz.toString() === quizId
    );

    if (existingQuiz) {
      // Update existing quiz record
      existingQuiz.marksScored = score;
      existingQuiz.totalMarks = totalMarks;
      existingQuiz.chapter = chapterId; // Update chapterId
    } else {
      // Add new quiz record
      learner.quizzes.push({
        course: courseId,
        chapter: chapterId, // Add chapterId
        quiz: quizId,
        marksScored: score,
        totalMarks: totalMarks,
      });
    }

    await learner.save();

    res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

const submitReview = async (req, res) => {
  const { courseId, learnerName, rating, comment } = req.body;

  try {
    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new review
    const review = new Review({
      courseId,
      learnerName,
      rating,
      comment,
      todaysdate: new Date().toISOString().split('T')[0], // Store today's date in YYYY-MM-DD format
    });

    await review.save();

    // Push the new review into the Course's reviews array
    course.reviews.push({
      learnerName, // Store Learner name instead of ID
      comment,
      rating,
    });

    await course.save();


    res.status(200).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Fetch testimonials
const getTestimonials = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10); // latest 10 reviews

    const formatted = reviews.map((review) => ({
      name: review.learnerName,
      quote: review.comment,
      image: `https://api.dicebear.com/7.x/thumbs/svg?seed=${review.learnerName}`, // Dynamic avatar
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

const downloadCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id; // Assuming you have user authentication

  try {
    // Fetch course and user details (ensure user has passed the exam)
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const learner = await Learner.findById(userId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    const quizRecord = learner.quizzes.find(
      (quiz) => quiz.course.toString() === courseId && quiz.marksScored / quiz.totalMarks >= 0.6
    );

    if (!quizRecord) {
      return res.status(403).json({ message: 'You are not eligible for a certificate' });
    }

    // Generate the certificate PDF
    const doc = new PDFDocument({
      size: [600, 900], // Landscape size
      layout: 'landscape', // Landscape orientation
      margin: 50,
    });
    const fileName = `Certificate-${course.title}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add a background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    // Add a gradient border for the top
    const topGradient = doc.linearGradient(25, 25, doc.page.width - 25, 25); // Horizontal gradient
    topGradient.stop(0, '#BA2759') // Pink
              .stop(0.5, '#20DAC7') // Green
              .stop(1, '#FFFFFF'); // Fallback to white instead of transparent
    doc.rect(25, 25, doc.page.width - 50, 20).fill(topGradient);

    // Add a gradient border for the bottom
    const bottomGradient = doc.linearGradient(25, doc.page.height - 25, doc.page.width - 25, doc.page.height - 25); // Horizontal gradient
    bottomGradient.stop(0, '#FFFFFF') // Fallback to white instead of transparent
                  .stop(0.5, '#20DAC7') // Green
                  .stop(1, '#BF9F46'); // Yellow
    doc.rect(25, doc.page.height - 45, doc.page.width - 50, 20).fill(bottomGradient);

    // Add a gradient border for the left
    const leftGradient = doc.linearGradient(25, 25, 25, doc.page.height - 25); // Vertical gradient
    leftGradient.stop(0, '#BA2759') // Pink
                .stop(0.5, '#20DAC7') // Green
                .stop(1, '#FFFFFF'); // Fallback to white instead of transparent
    doc.rect(25, 25, 20, doc.page.height - 50).fill(leftGradient);

    // Add a gradient border for the right
    const rightGradient = doc.linearGradient(doc.page.width - 25, 25, doc.page.width - 25, doc.page.height - 25); // Vertical gradient
    rightGradient.stop(0, '#FFFFFF') // Fallback to white instead of transparent
                .stop(0.5, '#20DAC7') // Green
                .stop(1, '#BF9F46'); // Yellow
    doc.rect(doc.page.width - 45, 25, 20, doc.page.height - 50).fill(rightGradient);
    // Add Learnfinity logo
    const logoPath = path.join(__dirname, '../assets/logo.png'); // Adjust the path to your logo
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 100, 30, { width: 200 });
    }
    doc.moveDown(11);
    // Add "Certificate of Completion" title
    doc.font('Times-Bold').fontSize(30).fillColor('#000').text('Certificate of Completion', { align: 'center' });
    doc.moveDown(1);

    // Add Learner name
    doc.fontSize(20).fillColor('#000').text(`This certifies that`, { align: 'center' });
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(36).fillColor('#E93131').text(`${learner.firstName} ${learner.lastName}`, { align: 'center' });

    // Add course title
    doc.fontSize(20).fillColor('#000').text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(28).fillColor('#060270').text(`"${course.title}"`, { align: 'center' });
    doc.moveDown(1);

    // Add certificate date
    const certificateDate = new Date().toLocaleDateString();
    doc.fontSize(18).fillColor('#000').text(`Date: ${certificateDate}`, { align: 'center' });
    doc.moveDown(1);

    // Add footer with Learnfinity name
    doc.fontSize(16).fillColor('#888').text('Powered by Learnfinity', {
      align: 'center',
      baseline: 'bottom',
    });

    // End the PDF document
    doc.end();
  } catch (err) {
    console.error('Error generating certificate:', err);

    // If an error occurs, ensure the response is not left open
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate certificate' });
    }
  }
};

module.exports = { getEnrolledCourses,markLessonComplete,getQuiz,submitQuizAttempt,submitReview,downloadCertificate, getTestimonials };
