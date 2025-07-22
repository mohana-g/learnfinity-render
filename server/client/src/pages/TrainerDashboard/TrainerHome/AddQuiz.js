import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AddQuiz.css';

const AddQuiz = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);

  // Fetch existing quiz data on component load
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/courses/${courseId}/get-quiz`);
        const quiz = res.data;

        if (quiz) {
          setQuizTitle(quiz.title);
          setQuestions(
            quiz.questions.map((q) => ({
              question: q.question,
              options: q.options,
              correctAnswer: q.answer,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [courseId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = value;
    } else {
      const optionIndex = parseInt(field, 10);
      updatedQuestions[index].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${courseId}/add-quiz`, {
        title: quizTitle,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.correctAnswer,
          marks: 1,
        })),
      });
      alert('Quiz added successfully!');
      navigate(`/Trainer-dashboard/course-content/${courseId}`);
    } catch (error) {
      console.error('Error adding quiz:', error);
      alert('Failed to add quiz');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}/delete-quiz`);
      alert('Quiz deleted successfully!');
      navigate(`/Trainer-dashboard/course-content/${courseId}`);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };


  return (
    <div className='add-quiz-container'>
      <h1>{quizTitle ? 'Edit Quiz' : 'Add Quiz'}</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Enter Quiz Title</label>
          <input
            type='text'
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder='Enter quiz title'
            required
          />
        </div>
        {questions.map((q, index) => (
          <div key={index} className='question-group'>
            <h3>Question {index + 1}</h3>
            <input
              type='text'
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              placeholder='Enter your question'
              required
            />
            {['A', 'B', 'C', 'D'].map((label, optIndex) => (
              <div key={optIndex} className='option-group'>
                <label>Option {label}</label>
                <input
                  type='text'
                  value={q.options[optIndex]}
                  onChange={(e) => handleQuestionChange(index, optIndex.toString(), e.target.value)}
                  placeholder={`Enter option ${label}`}
                  required
                />
              </div>
            ))}
            <label>Correct Answer</label>
            <input
              type='text'
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              placeholder='Enter correct answer'
              required
            />
          </div>
        ))}
        <button type='button' onClick={addQuestion} className='add-question-btn'>
          Add Question
        </button>          
        <button type='button' onClick={handleDeleteQuiz} className='delete-quiz-btn'>
          Delete Quiz
        </button>
        <div className='button-group'>
          <button
            type='button'
            onClick={() => navigate(`/Trainer-dashboard/course-content/${courseId}`)}
            className='back-btn'
          >
            Back
          </button>
          <button type='submit' className='submit-btn'>
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;
