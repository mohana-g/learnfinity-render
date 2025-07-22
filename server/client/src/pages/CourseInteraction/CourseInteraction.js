// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './CourseInteraction.css';

// const CourseInteraction = () => {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [error, setError] = useState('');
//   const [completedLessons, setCompletedLessons] = useState([]);

//   // const [openChapterIndex, setOpenChapterIndex] = useState(null);
//   const [openLessonIndex, setOpenLessonIndex] = useState(null);

//   // Quiz states
//   const [quiz, setQuiz] = useState(null);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [score, setScore] = useState(0);

//   //Review states
//   const [learnerName, setLearnerName] = useState("");
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   //Certificate states
//   const [certificateEligible, setCertificateEligible] = useState(false);

//   // const toggleChapter = (index) => {
//   //   setOpenChapterIndex(openChapterIndex === index ? null : index);
//   //   setOpenLessonIndex(null); // Close lessons when switching chapters
//   // };

//   const toggleLesson = (index) => {
//     setOpenLessonIndex(openLessonIndex === index ? null : index);
//   };

//   const markLessonComplete = async (lessonId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put('/api/course-interaction/complete-lesson', { lessonId }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });      
//       setCompletedLessons([...completedLessons, lessonId]);
//     } catch (err) {
//       console.error('Failed to mark lesson as complete', err);
//     }
//   };  

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`/api/course-interaction/${courseId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCourse(response.data);
//         setCompletedLessons(response.data.completedLessons || []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch course');
//       }
//     };

//     fetchCourse();
//   }, [courseId]);

//   const fetchQuiz = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`/api/course-interaction/quiz/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuiz(response.data);
//     } catch (err) {
//       console.error('Failed to fetch quiz', err);
//     }
//   }, [courseId]);
  
//   useEffect(() => {
//     if (course && course.chapters.every(chapter =>
//       chapter.lessons.every(lesson => completedLessons.includes(lesson._id))
//     )) {
//       setShowQuiz(true);
//       fetchQuiz();
//     }
//   }, [course, completedLessons, fetchQuiz]);

  
//   const handleQuizSubmit = (e) => {
//     e.preventDefault();
//     let correctAnswers = 0;
  
//     // Calculate total marks based on the number of questions
//     const totalMarks = quiz.questions.length;
  
//     quiz.questions.forEach((question, index) => {
//       const selectedOption = e.target[`question-${index}`]?.value?.trim();
//       const correctAnswer = question.answer.trim();
  
//       if (selectedOption === correctAnswer) {
//         correctAnswers++;
//       }
//     });
  
//     // Calculate the score percentage for display purposes
//     const quizScore = (correctAnswers / totalMarks) * 100;
//     setScore(quizScore);
  
//     // Send raw marksScored and totalMarks to the backend
//     submitQuizAttempt(correctAnswers, totalMarks);
//   };
  
//   const submitQuizAttempt = async (score, totalMarks) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         '/api/course-interaction/submit-quiz',
//         {
//           quizId: quiz._id,
//           courseId: courseId,
//           chapterId: quiz.chapterId,
//           score: score,
//           totalMarks: totalMarks,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
  
//       alert(response.data.message);
//       setQuizCompleted(true); // Allow review section
//     } catch (err) {
//       console.error('Failed to submit quiz attempt:', err.response?.data?.message || err.message);
//     }
//   };
  
//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
  
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         '/api/course-interaction/submit-review',
//         {
//           courseId: course._id,
//           learnerName,
//           rating,
//           comment,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
  
//       alert(response.data.message);
//       setSubmitted(true);

//        // Check if the user is eligible for the certificate
//       if (score >= 60) {
//         setCertificateEligible(true);
//       }
//     } catch (err) {
//       console.error('Failed to submit review:', err.response?.data?.message || err.message);
//       alert('Failed to submit review. Please try again.');
//     }
//   };

//   const handleDownloadCertificate = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`/api/course-interaction/download-certificate/${courseId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//       responseType: 'blob', // Ensure the response is treated as a file
//     });

//     // Create a URL for the downloaded file
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `Certificate-${course.title}.pdf`); // Set the file name
//     document.body.appendChild(link);
//     link.click();
//     link.parentNode.removeChild(link);
//   } catch (err) {
//     console.error('Failed to download certificate:', err.response?.data?.message || err.message);
//     alert('Failed to download certificate. Please try again.');
//   }
// };

//   if (error) return <p className="courseinteraction-error">{error}</p>;
//   if (!course) return <p className="courseinteraction-loading">Loading...</p>;

//   return (
//     <div className="courseinteraction-page">
//       <h1>{course.title}</h1>
//       <img src={course.imageurl} alt={course.title} style={{ width: '300px', borderRadius: '10px' }} />
//       <p><strong>Description:</strong> {course.description}</p>
//       <p><strong>Instructor:</strong> {course.trainer?.fullName || 'Unknown'}</p>
//       <p><strong>Enrolled Learners:</strong> {course.learners.length}</p>
      
//       <h2 className="courseinteraction-chapters-title">Chapters</h2>
//       {course.chapters.map((chapter, chapterIndex) => (
//         <div key={chapter._id} className="courseinteraction-chapter">
//           <h3  className="courseinteraction-chapter-title">
//             Chapter {chapterIndex + 1}: {chapter.name}
//           </h3>
          
//             <ul className="courseinteraction-lessons">
//               {chapter.lessons.map((lesson, lessonIndex) => (
//                 <li key={lesson._id} className="courseinteraction-lesson">
//                   <p
//                     onClick={() => toggleLesson(lessonIndex)}
//                     className="courseinteraction-lesson-title"
//                   >
//                     <strong>Lesson {lesson.number || lessonIndex + 1}:</strong> {lesson.title}
//                     {completedLessons.includes(lesson._id) && ' ✔️'}
//                   </p>
//                   {openLessonIndex === lessonIndex && (
//                     <div className="courseinteraction-lesson-details">
//                       <p><strong>Description:</strong> {lesson.description || 'No description available.'}</p>
//                       {lesson.videoUrl ? (
//                         <video
//                           width="400"
//                           controls
//                           controlsList="nodownload"
//                           onEnded={() => markLessonComplete(lesson._id)}
//                         >
//                         <source src={`http://localhost:3000/${lesson.videoUrl.replace(/\\/g, "/")}`} type="video/mp4" />
//                         Your browser does not support the video tag.
//                         </video>
//                       ) : (
//                         <p>No video available</p>
//                       )}
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
          
//         </div>
//       ))}
//       {/* Quiz Section */}
//       {showQuiz && quiz && (
//         <div className="courseinteraction-quiz">
//           <h2>Quiz: {quiz.title}</h2>
//           <form onSubmit={handleQuizSubmit}>
//             {quiz.questions.map((question, index) => (
//               <div key={question._id} className="quiz-question">
//                 <p>{index + 1}. {question.question}</p>
//                 {question.options.map((option, optionIndex) => {
//                 const label = String.fromCharCode(65 + optionIndex); // A, B, C, D
//                 return (
//                   <label key={optionIndex}>
//                     <input
//                       type="radio"
//                       name={`question-${index}`}
//                       value={`${label}) ${option}`} // Match the "A) Option" format
//                       required
//                     />
//                     {label}) {option}
//                   </label>
//                 );
//               })}
//               </div>
//             ))}
//             <button type="submit" className="quiz-submit">Submit Quiz</button>
//           </form>
//           {score > 0 && (
//           <p
//             className={`quiz-score ${score >= 60 ? 'pass' : 'fail'}`}
//           >
//             Your Score: {score}% {score >= 60 ? '✅ Passed!' : '❌ Failed!'}
//           </p>
//         )}
//         </div>
//       )}

//       {/* Review Section */}
//       {quizCompleted && (
//         <div className="courseinteraction-review">
//           <h2>Leave a Review</h2>
//           <form onSubmit={handleSubmitReview}>
//             <label>
//               Name:
//               <input
//                 type="text"
//                 value={learnerName}
//                 onChange={(e) => setLearnerName(e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               Rating:
//               <div className="rating-stars">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span
//                     key={star}
//                     onClick={() => setRating(star)}
//                     style={{
//                       cursor: "pointer",
//                       color: star <= rating ? "gold" : "gray",
//                     }}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//             </label>
//             <label>
//               Comment:
//               <textarea
//                 placeholder="Share your thoughts..."
//                 rows="4"
//                 cols="50"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 required
//               ></textarea>
//             </label>
//             <button type="submit">Submit Review</button>
//           </form>
//           {submitted && (
//             <p className="review-submitted">
//               Thank you for your feedback! Your review has been submitted.
//             </p>
//           )}
//         </div>
//       )}
//       {/* Certificate Section */}
//       {certificateEligible && (
//       <div className="certificate-section">
//         <h2>Congratulations!</h2>
//         <p>You have passed the exam and completed the review. You can now download your certificate.</p>
//         <button
//           className="download-certificate-button"
//           onClick={() => handleDownloadCertificate()}
//         >
//           Download Certificate
//         </button>
//       </div>
//     )}
//     </div>
//   );
// };

// export default CourseInteraction;




import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PdfViewer from '../../components/pdfViewer/pdfViewer';
import './CourseInteraction.css';

const getFileType = (filePath) => {
  if (!filePath) return null;
  const ext = filePath.split('.').pop().toLowerCase();
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'docx';
  if (['ppt', 'pptx'].includes(ext)) return 'pptx';
  return 'other';
};

const CourseInteraction = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [openLessonIndex, setOpenLessonIndex] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [learnerName, setLearnerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [certificateEligible, setCertificateEligible] = useState(false);

  const toggleLesson = (index) => {
    setOpenLessonIndex(openLessonIndex === index ? null : index);
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/course-interaction/complete-lesson', { lessonId }, {
        headers: { Authorization: `Bearer ${token}` },
      });      
      setCompletedLessons([...completedLessons, lessonId]);
    } catch (err) {
      console.error('Failed to mark lesson as complete', err);
    }
  };  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/course-interaction/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(response.data);
        setCompletedLessons(response.data.completedLessons || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      }
    };
    fetchCourse();
  }, [courseId]);

  const fetchQuiz = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/course-interaction/quiz/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(response.data);
    } catch (err) {
      console.error('Failed to fetch quiz', err);
    }
  }, [courseId]);

  useEffect(() => {
    if (course && course.chapters.every(chapter =>
      chapter.lessons.every(lesson => completedLessons.includes(lesson._id))
    )) {
      setShowQuiz(true);
      fetchQuiz();
    }
  }, [course, completedLessons, fetchQuiz]);

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let correctAnswers = 0;
    const totalMarks = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      const selectedOption = e.target[`question-${index}`]?.value?.trim();
      const correctAnswer = question.answer.trim();
      if (selectedOption === correctAnswer) {
        correctAnswers++;
      }
    });

    const quizScore = (correctAnswers / totalMarks) * 100;
    setScore(quizScore);
    submitQuizAttempt(correctAnswers, totalMarks);
  };

  const submitQuizAttempt = async (score, totalMarks) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/course-interaction/submit-quiz',
      {
        quizId: quiz._id,
        courseId: courseId,
        chapterId: quiz.chapterId,
        score: score,
        totalMarks: totalMarks,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const percentage = (score / totalMarks) * 100;

    if (percentage >= 60) {
      alert(`✅ Congratulations! You passed with ${percentage}%.`);
      setQuizCompleted(true);
    } else {
      alert(`❌ You scored ${percentage}%. Minimum 60% required. Please try again.`);
      setQuizCompleted(false);
    }

  } catch (err) {
    console.error('Failed to submit quiz attempt:', err.response?.data?.message || err.message);
  }
};

//old score popup command
  // const submitQuizAttempt = async (score, totalMarks) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.post(
  //       '/api/course-interaction/submit-quiz',
  //       {
  //         quizId: quiz._id,
  //         courseId: courseId,
  //         chapterId: quiz.chapterId,
  //         score: score,
  //         totalMarks: totalMarks,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     alert(response.data.message);
  //     setQuizCompleted(true);
  //   } catch (err) {
  //     console.error('Failed to submit quiz attempt:', err.response?.data?.message || err.message);
  //   }
  // };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/course-interaction/submit-review',
        {
          courseId: course._id,
          learnerName,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      setSubmitted(true);
      if (score >= 60) {
        setCertificateEligible(true);
      }
    } catch (err) {
      console.error('Failed to submit review:', err.response?.data?.message || err.message);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/course-interaction/download-certificate/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${course.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download certificate:', err.response?.data?.message || err.message);
      alert('Failed to download certificate. Please try again.');
    }
  };

  if (error) return <p className="courseinteraction-error">{error}</p>;
  if (!course) return <p className="courseinteraction-loading">Loading...</p>;

  return (
    <div className="courseinteraction-page">
      <h1>{course.title}</h1>
      <img src={course.imageurl} alt={course.title} style={{ width: '300px', borderRadius: '10px' }} />
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Instructor:</strong> {course.trainer?.fullName || 'Unknown'}</p>
      <p><strong>Enrolled Learners:</strong> {course.learners.length}</p>

      <h2 className="courseinteraction-chapters-title">Chapters</h2>
      {course.chapters.map((chapter, chapterIndex) => (
        <div key={chapter._id} className="courseinteraction-chapter">
          <h3 className="courseinteraction-chapter-title">
            Chapter {chapterIndex + 1}: {chapter.name}
          </h3>
          <ul className="courseinteraction-lessons">
            {chapter.lessons.map((lesson, lessonIndex) => (
              <li key={lesson._id} className="courseinteraction-lesson">
                <p onClick={() => toggleLesson(lessonIndex)} className="courseinteraction-lesson-title">
                  <strong>Lesson {lesson.number || lessonIndex + 1}:</strong> {lesson.title}
                  {completedLessons.includes(lesson._id) && ' ✔️'}
                </p>
                {openLessonIndex === lessonIndex && (
                  <div className="courseinteraction-lesson-details">
                    <p><strong>Description:</strong> {lesson.description || 'No description available.'}</p>
                    {lesson.videoUrl && (() => {
                      const type = getFileType(lesson.videoUrl);
                      const fullPath = `http://localhost:5000/${lesson.videoUrl.replace(/\\/g, "/")}`;

                      switch (type) {
                        case 'video':
                          return (
                            <video width="400" controls controlsList="nodownload" onEnded={() => markLessonComplete(lesson._id)}>
                              <source src={fullPath} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          );

                        case 'pdf':
                          return (
                            <div style={{ marginTop: '20px' }}>
                              <h4>📄 PDF Document</h4>
                              <>
                                <PdfViewer fileUrl={fullPath} />
                                {!completedLessons.includes(lesson._id) && (
                                  <button
                                    style={{ marginTop: '10px' }}
                                    onClick={() => markLessonComplete(lesson._id)}
                                  >
                                    Mark as Read
                                  </button>
                                )}
                              </>
                            </div>
                          );

                        case 'docx':
                        case 'ppt':
                        case 'pptx':
                          return (
                            <div style={{ marginTop: '20px' }}>
                              <h4>📄 Document Preview</h4>
                              <>
                                {window.location.hostname === 'localhost' ? (
                                  <div style={{ color: 'red' }}>
                                    ❗ Cannot preview documents on localhost. <br />
                                    <a href={fullPath} download target="_blank" rel="noopener noreferrer">
                                      Click here to download and view the document.
                                    </a>
                                  </div>
                                ) : (
                                  <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullPath)}`}
                                    width="100%"
                                    height="500px"
                                    frameBorder="0"
                                    title="Office File Viewer"
                                  />
                                )}
                                {!completedLessons.includes(lesson._id) && (
                                  <button
                                    style={{ marginTop: '10px' }}
                                    onClick={() => markLessonComplete(lesson._id)}
                                  >
                                    Mark as Read
                                  </button>
                                )}
                              </>
                            </div>
                          );

                        default:
                          return <p>⚠️ Unsupported file format</p>;
                      }
                    })()}

                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {showQuiz && quiz && (
        <div className="courseinteraction-quiz">
          <h2>Quiz: {quiz.title}</h2>
          <form onSubmit={handleQuizSubmit}>
            {quiz.questions.map((question, index) => (
              <div key={question._id} className="quiz-question">
                <p>{index + 1}. {question.question}</p>
                {question.options.map((option, optionIndex) => {
                  const label = String.fromCharCode(65 + optionIndex);
                  return (
                    <label key={optionIndex}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={`${label}) ${option}`}
                        required
                      />
                      {label}) {option}
                    </label>
                  );
                })}
              </div>
            ))}
            <button type="submit" className="quiz-submit">Submit Quiz</button>
          </form>
          {score > 0 && (
            <p className={`quiz-score ${score >= 60 ? 'pass' : 'fail'}`}>
              Your Score: {score}% {score >= 60 ? '✅ Passed!' : '❌ Failed!'}
            </p>
          )}
        </div>
      )}

      {quizCompleted && (
        <div className="courseinteraction-review">
          <h2>Leave a Review</h2>
          <form onSubmit={handleSubmitReview}>
            <label>
              Name:
              <input type="text" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} required />
            </label>
            <label>
              Rating:
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      cursor: "pointer",
                      color: star <= rating ? "gold" : "gray",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </label>
            <label>
              Comment:
              <textarea
                placeholder="Share your thoughts..."
                rows="4"
                cols="50"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </label>
            <button type="submit">Submit Review</button>
          </form>
          {submitted && <p className="review-submitted">Thank you for your feedback! Your review has been submitted.</p>}
        </div>
      )}

      {certificateEligible && (
        <div className="certificate-section">
          <h2>Congratulations!</h2>
          <p>You have passed the exam and completed the review. You can now download your certificate.</p>
          <button className="download-certificate-button" onClick={() => handleDownloadCertificate()}>
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseInteraction;
