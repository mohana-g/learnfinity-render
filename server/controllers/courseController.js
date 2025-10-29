const pool = require("../config/db");

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
    const trainerId = req.user.id;

    // Check if Trainer exists and is approved
    const trainerRes = await pool.query(`SELECT * FROM trainers WHERE id = $1`, [trainerId]);
    const trainer = trainerRes.rows[0];

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    if (trainer.flag !== 2) {
      return res.status(403).json({ success: false, message: "Access denied. Approval required." });
    }

    // Insert new course
   const newCourse = await pool.query(
      `INSERT INTO courses (title, name, description, trainer_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [title, name, description, trainerId]
    );

    res.status(201).json({
      success: true,
      message: "Course added successfully!",
      course: newCourse.rows[0],
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// ✅ Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*, 
        t.full_name AS trainer_name,
        COUNT(lc.learner_id) AS enrolled_count
      FROM courses c
      LEFT JOIN trainer t ON c.trainer_id = t.id
      LEFT JOIN learner_courses lc ON lc.course_id = c.id
      GROUP BY c.id, t.full_name
      ORDER BY c.created_at DESC;
    `);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch courses", 
      error: error.message 
    });
  }
};


// ✅ Get a Single Course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // ✅ 1. Fetch main course details
    const courseResult = await pool.query(`
  SELECT 
    c.id,
    c.title,
    c.name AS course_name,
    c.description,
    c.imageurl,
    c.instructor_name,
    c.trainer_id,
    t.full_name AS trainer_name,
    t.email AS trainer_email,
    COUNT(DISTINCT lc.learner_id) AS enrolled_count,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(r.id) AS review_count
  FROM courses c
  LEFT JOIN trainer t ON c.trainer_id = t.id
  LEFT JOIN learner_courses lc ON lc.course_id = c.id
  LEFT JOIN reviews r ON r.course_id = c.id
  WHERE c.id = $1
  GROUP BY c.id, c.title, c.name, c.description, c.imageurl, c.instructor_name, 
           c.trainer_id, t.full_name, t.email;
`, [courseId]);


    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = courseResult.rows[0];

    // ✅ 2. Fetch all reviews (no join needed)
    const reviewResult = await pool.query(`
      SELECT 
        id,
        learner_name,
        rating,
        comment,
        todaysdate
      FROM reviews
      WHERE course_id = $1
      ORDER BY created_at DESC
    `, [courseId]);

    // ✅ 3. Return combined result
    res.status(200).json({
      success: true,
      data: {
        id: course.id,
        title: course.title,
        name: course.course_name,
        description: course.description,
        imageurl: course.imageurl,
        instructor_name: course.instructor_name,
        trainer: {
          id: course.trainer_id,
          fullName: course.trainer_name,
          email: course.trainer_email,
        },
        enrolled_count: parseInt(course.enrolled_count, 10),
        averageRating: parseFloat(course.average_rating).toFixed(1),
        reviewCount: parseInt(course.review_count, 10),
        reviews: reviewResult.rows.map((r) => ({
          id: r.id,
          learnerName: r.learner_name,
          rating: r.rating,
          comment: r.comment,
          date: r.todaysdate,
        })),
      },
    });

  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error", error });
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
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.name,
        c.description,
        c.imageurl,
        COUNT(lc.learner_id) AS "learnerCount",
        t.full_name AS "trainer_full_name",
        t.email AS "trainer_email",
        t.institute AS "trainer_institute",
        t.phone_number AS "trainer_phone_number"
      FROM courses c
      LEFT JOIN learner_courses lc ON c.id = lc.course_id
      LEFT JOIN trainer t ON c.trainer_id = t.id
      GROUP BY c.id, t.full_name, t.email, t.institute, t.phone_number
      ORDER BY "learnerCount" DESC
      LIMIT 4
    `);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    res.status(500).json({ success: false, message: "Error fetching popular courses", error });
  }
};

// ✅ Update Course
const updateCourse = async (req, res) => {
  try {
    const { title, name, description } = req.body;
    const { courseId } = req.params;

    const imageurl = req.file ? `/uploads/${req.file.filename}` : null;

    const updated = await pool.query(
      `UPDATE courses 
       SET title = COALESCE($1, title), 
           name = COALESCE($2, name), 
           description = COALESCE($3, description),
           imageurl = COALESCE($4, imageurl),
           updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, name, description, imageurl, courseId]
    );

    if (updated.rows.length === 0) return res.status(404).json({ message: "Course not found" });

    res.json({ success: true, message: "Course updated successfully", data: updated.rows[0] });
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
    const uploadedVideos = req.files;

    const BASE_URL = process.env.BASE_URL || "https://hilms.onrender.com";

    for (const chapter of parsedChapters) {
      let chapterId;

      // ✅ Update existing or create new chapter
      if (chapter.chapterId) {
        const chapterRes = await pool.query(
          `UPDATE chapters
           SET name = COALESCE($1, name)
           WHERE id = $2
           RETURNING id`,
          [chapter.chapterName, chapter.chapterId]
        );
        chapterId = chapterRes.rows[0].id;
      } else {
        const chapterRes = await pool.query(
          `INSERT INTO chapters (course_id, name)
           VALUES ($1, $2)
           RETURNING id`,
          [courseId, chapter.chapterName]
        );
        chapterId = chapterRes.rows[0].id;
      }

      // ✅ Handle lessons in each chapter
      for (const lesson of chapter.lessons) {
        const videoFile = uploadedVideos?.find(
          (file) => file.originalname === lesson.videoUrl
        );

        // ✅ Full public URL only if a new file was uploaded
        const videoPath = videoFile
          ? `${BASE_URL}/uploads/${path.basename(videoFile.path)}`
          : null;

        if (lesson.lessonId) {
          // Update lesson (only replace video_url if a new file is uploaded)
          await pool.query(
            `UPDATE lessons
             SET number = COALESCE($1, number),
                 title = COALESCE($2, title),
                 description = COALESCE($3, description),
                 video_url = COALESCE($4, video_url)
             WHERE id = $5`,
            [lesson.number, lesson.title, lesson.description, videoPath, lesson.lessonId]
          );
        } else {
          // Create new lesson
          await pool.query(
            `INSERT INTO lessons (chapter_id, number, title, description, video_url)
             VALUES ($1, $2, $3, $4, $5)`,
            [chapterId, lesson.number, lesson.title, lesson.description, videoPath]
          );
        }
      }
    }

    res.status(200).json({ message: "Chapters and lessons uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading chapters and lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get existing chapters and lessons for a course
const getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch chapters and their lessons using LEFT JOIN
    const result = await pool.query(
      `
      SELECT 
        c.id AS chapter_id,
        c.name AS chapter_name,
        l.id AS lesson_id,
        l.number AS lesson_number,
        l.title AS lesson_title,
        l.description AS lesson_description,
        l.video_url AS lesson_video_url
      FROM chapters c
      LEFT JOIN lessons l ON c.id = l.chapter_id
      WHERE c.course_id = $1
      ORDER BY c.id, l.number
      `,
      [courseId]
    );

    // Group lessons by chapter (to mimic MongoDB populate behavior)
    const chaptersMap = {};

    result.rows.forEach(row => {
      if (!chaptersMap[row.chapter_id]) {
        chaptersMap[row.chapter_id] = {
          id: row.chapter_id,
          name: row.chapter_name,
          lessons: []
        };
      }

      if (row.lesson_id) {
        chaptersMap[row.chapter_id].lessons.push({
          id: row.lesson_id,
          number: row.lesson_number,
          title: row.lesson_title,
          description: row.lesson_description,
          video_url: row.lesson_video_url
        });
      }
    });

    // Convert map to array for JSON response
    const chapters = Object.values(chaptersMap);

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove a chapter and its lessons
const removeChapter = async (req, res) => {
  const { courseId, chapterId } = req.params;

  // ✅ Validate numeric IDs
  if (isNaN(courseId) || isNaN(chapterId)) {
    return res.status(400).json({ message: "Invalid course or chapter ID" });
  }

  try {
    // ✅ Check if course exists
    const courseResult = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Check if chapter belongs to this course
    const chapterResult = await pool.query(
      "SELECT * FROM chapters WHERE id = $1 AND course_id = $2",
      [chapterId, courseId]
    );
    if (chapterResult.rows.length === 0) {
      return res.status(404).json({ message: "Chapter not found for this course" });
    }

    // ✅ Delete all lessons under this chapter
    await pool.query("DELETE FROM lessons WHERE chapter_id = $1", [chapterId]);

    // ✅ Delete the chapter itself
    await pool.query("DELETE FROM chapters WHERE id = $1", [chapterId]);

    // ⚠️ In PostgreSQL, chapters are linked via `course_id` (no array field),
    // so no need for `$pull` like in MongoDB. The relation is automatically clean.

    res.status(200).json({ message: "Chapter and its lessons removed successfully" });
  } catch (error) {
    console.error("Error removing chapter:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove a lesson
const removeLesson = async (req, res) => {
  const { chapterId, lessonId } = req.params;

  // ✅ Validate numeric IDs
  if (isNaN(chapterId) || isNaN(lessonId)) {
    return res.status(400).json({ message: "Invalid chapter or lesson ID" });
  }

  try {
    // ✅ Check if chapter exists
    const chapterResult = await pool.query("SELECT * FROM chapters WHERE id = $1", [chapterId]);
    if (chapterResult.rows.length === 0) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // ✅ Check if lesson belongs to this chapter
    const lessonResult = await pool.query(
      "SELECT * FROM lessons WHERE id = $1 AND chapter_id = $2",
      [lessonId, chapterId]
    );
    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: "Lesson not found for this chapter" });
    }

    // ✅ Delete the lesson
    await pool.query("DELETE FROM lessons WHERE id = $1", [lessonId]);

    res.status(200).json({ message: "Lesson removed successfully" });
  } catch (error) {
    console.error("Error removing lesson:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Add or update quiz for a course
const addQuiz = async (req, res) => {
  const { courseId } = req.params;
  const { title, questions } = req.body;

  try {
    // ✅ Check if course exists
    const courseResult = await pool.query("SELECT id FROM courses WHERE id = $1", [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ✅ Check if quiz already exists for this course
    const existingQuiz = await pool.query("SELECT * FROM quizzes WHERE course_id = $1", [courseId]);

    let quizId;

    if (existingQuiz.rows.length > 0) {
      // ✅ Update existing quiz
      quizId = existingQuiz.rows[0].id;
      await pool.query("UPDATE quizzes SET title = $1, updated_at = NOW() WHERE id = $2", [title, quizId]);

      // Delete old questions before inserting new ones
      await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);
    } else {
      // ✅ Create new quiz
      const newQuiz = await pool.query(
        "INSERT INTO quizzes (title, course_id) VALUES ($1, $2) RETURNING id",
        [title, courseId]
      );
      quizId = newQuiz.rows[0].id;
    }

    // ✅ Insert all new questions
    if (questions && Array.isArray(questions) && questions.length > 0) {
      for (const q of questions) {
        await pool.query(
          `INSERT INTO quiz_questions (quiz_id, question, options, answer, marks)
           VALUES ($1, $2, $3, $4, $5)`,
          [quizId, q.question, q.options, q.answer, q.marks]
        );
      }
    }

    // ✅ Fetch updated quiz with questions
    const quizData = await pool.query(
      `SELECT q.id AS quiz_id, q.title, q.course_id, 
              json_agg(
                json_build_object(
                  'id', qq.id,
                  'question', qq.question,
                  'options', qq.options,
                  'answer', qq.answer,
                  'marks', qq.marks
                )
              ) AS questions
       FROM quizzes q
       LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
       WHERE q.id = $1
       GROUP BY q.id`,
      [quizId]
    );

    res.status(200).json({ message: "Quiz added successfully", quiz: quizData.rows[0] });
  } catch (error) {
    console.error("Error adding quiz:", error.message);
    res.status(500).json({ error: "Failed to add quiz" });
  }
};

// Get quiz by course ID
const getQuizByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    // ✅ Check if quiz exists for the given course
    const quizResult = await pool.query(
      `SELECT q.id AS quiz_id, q.title, q.course_id,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', qq.id,
                    'question', qq.question,
                    'options', qq.options,
                    'answer', qq.answer,
                    'marks', qq.marks
                  )
                ) FILTER (WHERE qq.id IS NOT NULL), '[]'
              ) AS questions
       FROM quizzes q
       LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
       WHERE q.course_id = $1
       GROUP BY q.id`,
      [courseId]
    );

    // ✅ If no quiz found
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ Return quiz (with questions array)
    res.status(200).json(quizResult.rows[0]);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  const { courseId } = req.params;

  // ✅ Validate numeric ID
  if (isNaN(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    // ✅ Check if quiz exists for the course
    const quizResult = await pool.query(
      "SELECT id FROM quizzes WHERE course_id = $1",
      [courseId]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizId = quizResult.rows[0].id;

    // ✅ Delete all quiz questions (ON DELETE CASCADE will handle this too, but we ensure it manually)
    await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);

    // ✅ Delete the quiz itself
    await pool.query("DELETE FROM quizzes WHERE id = $1", [quizId]);

    // ⚠️ In PostgreSQL, the `quizzes` table links to `courses` via `course_id`,
    // not through an array — so no `$pull` is needed (relation is automatically clean).

    res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    res.status(500).json({ message: "Failed to delete quiz", error });
  }
};


// Fetch course details by ID
const fetchCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate numeric courseId
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    // Fetch course with trainer details
    const courseResult = await pool.query(
      `
      SELECT 
        c.id AS course_id,
        c.title,
        c.name,
        c.description,
        c.imageurl,
        c.instructor_name,
        c.updated_at,
        t.id AS trainer_id,
        t.full_name AS trainer_fullname,
        t.email AS trainer_email,
        t.institute AS trainer_institute,
        t.phone_number AS trainer_phonenumber
      FROM courses c
      LEFT JOIN trainer t ON c.trainer_id = t.id
      WHERE c.id = $1
      `,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const course = courseResult.rows[0];

    // Fetch chapters and lessons
    const chaptersResult = await pool.query(
      `
      SELECT 
        ch.id AS chapter_id,
        ch.name AS chapter_name,
        ls.id AS lesson_id,
        ls.number AS lesson_number,
        ls.title AS lesson_title,
        ls.description AS lesson_description
      FROM chapters ch
      LEFT JOIN lessons ls ON ch.id = ls.chapter_id
      WHERE ch.course_id = $1
      ORDER BY ch.id, ls.number
      `,
      [courseId]
    );

    // Group lessons by chapter
    const chaptersMap = {};
    chaptersResult.rows.forEach((row) => {
      if (!chaptersMap[row.chapter_id]) {
        chaptersMap[row.chapter_id] = {
          id: row.chapter_id,
          name: row.chapter_name,
          lessons: [],
        };
      }

      if (row.lesson_id) {
        chaptersMap[row.chapter_id].lessons.push({
          id: row.lesson_id,
          number: row.lesson_number,
          title: row.lesson_title,
          description: row.lesson_description,
        });
      }
    });

    const chapters = Object.values(chaptersMap);

    // Fetch quizzes and questions
    const quizzesResult = await pool.query(
      `
      SELECT 
        q.id AS quiz_id,
        q.title AS quiz_title,
        qq.id AS question_id,
        qq.question,
        qq.options,
        qq.answer,
        qq.marks
      FROM quizzes q
      LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
      WHERE q.course_id = $1
      ORDER BY q.id, qq.id
      `,
      [courseId]
    );

    const quizzesMap = {};
    quizzesResult.rows.forEach((row) => {
      if (!quizzesMap[row.quiz_id]) {
        quizzesMap[row.quiz_id] = {
          id: row.quiz_id,
          title: row.quiz_title,
          questions: [],
        };
      }

      if (row.question_id) {
        quizzesMap[row.quiz_id].questions.push({
          id: row.question_id,
          question: row.question,
          options: row.options,
          answer: row.answer,
          marks: row.marks,
        });
      }
    });

    const quizzes = Object.values(quizzesMap);

    // ✅ Fetch learners enrolled in the course
    const learnersResult = await pool.query(
      `
      SELECT l.id, l.first_name, l.last_name, l.email
      FROM learner_courses lc
      JOIN learner l ON lc.learner_id = l.id
      WHERE lc.course_id = $1
      `,
      [courseId]
    );

    const learners = learnersResult.rows || [];

    // ✅ Fetch reviews
    const reviewsResult = await pool.query(
      `
      SELECT id, learner_name, rating, comment, todaysdate
      FROM reviews
      WHERE course_id = $1
      ORDER BY created_at DESC
      `,
      [courseId]
    );

    const reviews = reviewsResult.rows;
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? (
            reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviewCount
          ).toFixed(1)
        : "0.0";

    // ✅ Count total lessons
    const lessonCount = chapters.reduce(
      (total, chapter) => total + (chapter.lessons ? chapter.lessons.length : 0),
      0
    );

    // ✅ Combine and return response
    res.status(200).json({
      success: true,
      data: {
        id: course.course_id,
        title: course.title,
        name: course.name,
        description: course.description,
        imageurl: course.imageurl,
        instructor_name: course.instructor_name,
        updated_at: course.updated_at,
        trainer: {
          id: course.trainer_id,
          fullName: course.trainer_fullname,
          email: course.trainer_email,
          institute: course.trainer_institute,
          phoneNumber: course.trainer_phonenumber,
        },
        chapters,
        quizzes,
        learners,
        lessonCount,
        reviews,
        averageRating,
        reviewCount,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching course details:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Enroll a Learner in a course
const enrollCourse = async (req, res) => {
  const client = await pool.connect();
  try {
    const learnerId = req.user.id; // from auth middleware
    const { courseId } = req.params;

    await client.query("BEGIN");

    // 1️⃣ Check if course exists
    const courseResult = await client.query(
      "SELECT * FROM courses WHERE id = $1",
      [courseId]
    );
    if (courseResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Check if learner exists
    const learnerResult = await client.query(
      "SELECT * FROM learner WHERE id = $1",
      [learnerId]
    );
    if (learnerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Learner not found" });
    }

    // 3️⃣ Check if already enrolled
    const existingEnrollment = await client.query(
      "SELECT * FROM learner_courses WHERE course_id = $1 AND learner_id = $2",
      [courseId, learnerId]
    );
    if (existingEnrollment.rows.length > 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // 4️⃣ Enroll learner
    await client.query(
      "INSERT INTO learner_courses (course_id, learner_id) VALUES ($1, $2)",
      [courseId, learnerId]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Successfully enrolled in the course" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Enrollment error:", error.message);
    res.status(500).json({ message: "Failed to enroll", error: error.message });
  } finally {
    client.release();
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

