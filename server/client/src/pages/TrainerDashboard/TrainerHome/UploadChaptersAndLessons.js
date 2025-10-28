import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadChaptersAndLessons.css";

function UploadChaptersAndLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([{ chapterName: "", lessons: [{ number: "", title: "", description: "", video: null }] }]);

  const handleAddChapter = () => {
    setChapters([...chapters, { chapterName: "", lessons: [{ number: "", title: "", description: "", video: null }] }]);
  };

  const handleAddLesson = (chapterIndex) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons.push({ number: "", title: "", description: "", video: null });
    setChapters(updatedChapters);
  };

  const handleChapterChange = (index, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].chapterName = value;
    setChapters(updatedChapters);
  };

  const handleLessonChange = (chapterIndex, lessonIndex, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(updatedChapters);
  };

  // const handleVideoUpload = (chapterIndex, lessonIndex, file) => {
  //   const updatedChapters = [...chapters];
  //   const videoURL = URL.createObjectURL(file); // Instant preview for new upload
  //   updatedChapters[chapterIndex].lessons[lessonIndex].video = file;
  //   updatedChapters[chapterIndex].lessons[lessonIndex].videoUrl = videoURL; // Update videoUrl immediately
  //   setChapters(updatedChapters);
  // };

const handleVideoUpload = (chapterIndex, lessonIndex, file) => {
  if (!file) return; // 🔒 Prevent undefined file access

  const updatedChapters = [...chapters];
  const videoURL = URL.createObjectURL(file); // Preview
  updatedChapters[chapterIndex].lessons[lessonIndex].video = file;
  updatedChapters[chapterIndex].lessons[lessonIndex].videoUrl = videoURL;
  setChapters(updatedChapters);
};

  const handleRemoveChapter = async (courseId, chapterId, setChapters, chapters) => {
  try {
    await axios.delete(`https://hilms.onrender.com/api/courses/${courseId}/chapters/${chapterId}`);
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    alert('Chapter removed successfully!');
  } catch (error) {
    console.error('Error removing chapter:', error.message);
    alert('Failed to remove chapter.');
  }
};

const handleRemoveLesson = async (courseId, chapterId, lessonId, setChapters, chapters) => {
  try {
    await axios.delete(`https://hilms.onrender.com/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
    const updatedChapters = chapters.map((chapter) => {
      if (chapter.id === chapterId) {
        chapter.lessons = chapter.lessons.filter((lesson) => lesson.id !== lessonId);
      }
      return chapter;
    });
    setChapters(updatedChapters);
    alert('Lesson removed successfully!');
  } catch (error) {
    console.error('Error removing lesson:', error.message);
    alert('Failed to remove lesson.');
  }
};
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", courseId);
  
    // Append chapters data (without videos)
    formData.append("chapters", JSON.stringify(chapters.map((chapter) => ({
      chapterId: chapter.id || null,
      chapterName: chapter.chapterName,
      lessons: chapter.lessons.map((lesson) => ({
        lessonId: lesson.id || null,
        number: lesson.number,
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.video ? lesson.video.name : lesson.videoUrl || "", // File name for preview
      })),
    }))));
  
    // Append video files
    chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        if (lesson.video) {
          formData.append("videos", lesson.video); // Actual file, not URL
        }
      });
    });
  
    try {
      await axios.post("https://hilms.onrender.com/api/courses/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Chapters and lessons uploaded successfully!");
      navigate(`/trainer-dashboard/course-content/${courseId}`);
    } catch (error) {
      console.error("Error uploading data", error);
      alert("Failed to upload data");
    }
  };
  
  const handleBack = () => {
    navigate(`/trainer-dashboard/course-content/${courseId}`);
  };

  // Fetch existing chapters and lessons
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`https://hilms.onrender.com/api/courses/${courseId}/chapters`);
        const formattedChapters = response.data.map((chapter) => ({
          id: chapter.id,
          chapterName: chapter.name, // Ensure consistency with form fields
          //description: chapter.description || "",
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            number: lesson.number || "",
            title: lesson.title || "", // Ensure lesson name matches your form
            description: lesson.description || "",
            videoUrl: lesson.videoUrl ? `https://hilms.onrender.com/${lesson.videoUrl}` : "", // Ensure full URL
          })),
        }));
        setChapters(formattedChapters);
      } catch (error) {
        console.error("Error fetching chapters", error);
      }
    };    

    fetchChapters();
  }, [courseId]);

  return (
    <div className="upload-container">
      <h1>Upload Chapters and Lessons</h1>
      <form onSubmit={handleSubmit}>
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="chapter-container">
            <div className="form-group">
              <label htmlFor={`chapterName-${chapterIndex}`}>Chapter Name</label>
              <input
                type="text"
                id={`chapterName-${chapterIndex}`}
                value={chapter.chapterName}
                onChange={(e) => handleChapterChange(chapterIndex, e.target.value)}
                required
              />
              <button
                type="button"
                className="upload-btn remove"
                onClick={() => handleRemoveChapter(courseId, chapter.id, setChapters, chapters)}
                >
                Remove Chapter
              </button>
            </div>

            <div className="lessons-container">
              <h3>Lessons</h3>
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="lesson-item">
                  <input
                    type="text"
                    placeholder="Lesson Number"
                    value={lesson.number}
                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "number", e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder={`Lesson Title`}
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "title", e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Lesson Description"
                    value={lesson.description}
                    onChange={(e) => handleLessonChange(chapterIndex, lessonIndex, "description", e.target.value)}
                    required
                  ></textarea>
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png,.gif,.webp,.mp4,.mpeg,.mov,.pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleVideoUpload(chapterIndex, lessonIndex, e.target.files[0])}
                  />

                  {lesson.videoUrl ? (
                    lesson.videoUrl.match(/\.(mp4|mov|mpeg)$/i) ? (
                      <video controls width="250" src={lesson.videoUrl} className="lesson-video-preview">
                        Your browser does not support the video tag.
                      </video>
                    ) : lesson.videoUrl.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                      <img src={lesson.videoUrl} alt="Uploaded Preview" width="250" />
                    ) : (
                      <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">
                        📄 View Document
                      </a>
                    )
                  ) : (
                    <p>No file uploaded</p>
                  )}

                  {/*<button
                    type="button"
                    className="upload-btn update"
                    onClick={() => alert("Lesson updated!")}
                  >
                    Update Lesson
                  </button>*/}

                  <button
                    type="button"
                    className="upload-btn remove"
                    onClick={() => handleRemoveLesson(courseId, chapter.id, lesson.id, setChapters, chapters)}
                    >
                    Remove Lesson
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="upload-btn add"
                onClick={() => handleAddLesson(chapterIndex)}
              >
                Add Lesson
              </button>
            </div>
          </div>
        ))}

        <button type="button" className="upload-btn add" onClick={handleAddChapter}>
          Add Chapter
        </button>

        <button type="submit" className="upload-btn submit">
          Submit
        </button>

        <button type="button" className="upload-btn back" onClick={handleBack}>
          Back
        </button>
      </form>
    </div>
  );
}

export default UploadChaptersAndLessons;
