/*
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './AdminSendMail.css';

const AdminSendMail = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [LearnerEmails, setLearnerEmails] = useState([]);

  useEffect(() => {
    // Fetch Learner emails from the backend
    fetch('http://localhost:5000/api/Learner/Learners')
      .then(response => response.json())
      .then(data => setLearnerEmails(data.map(Learner => Learner.email)))
      .catch(error => console.error('Error fetching Learner emails:', error));
  }, []);

  const handleSendMail = () => {
    if (!subject || !message) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    if (LearnerEmails.length === 0) {
      setErrorMessage('No Learners found.');
      return;
    }

    // Prepare email params
    const emailParams = {
      subject: subject,
      message: message,
      to_email: LearnerEmails.join(','), // Send to all Learners
    };

    // Send email using EmailJS
    emailjs.send(
      'service_jtatsrq',  // Replace with your EmailJS Service ID
      'template_44rrn4p', // Replace with your EmailJS Template ID
      emailParams,
      '8TOkSAnsc4yfF81je'   // Replace with your EmailJS Public Key
    )
    .then((response) => {
      console.log('Email sent successfully:', response);
      setSuccessMessage('Emails sent successfully!');
      setErrorMessage('');
      setSubject('');
      setMessage('');
    })
    .catch((error) => {
      console.error('Email sending failed:', error);
      setErrorMessage('Failed to send emails.');
    });
  };

  return (
    <div className="admin-send-mail-container">
      <h1>Email Sending Form</h1>
      <div className="form-group">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Description:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your description"
        ></textarea>
      </div>
      <button className="send-mail-btn" onClick={handleSendMail}>Send Mail</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AdminSendMail;
*/
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './AdminSendMail.css';

const AdminSendMail = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [learnerEmails, setLearnerEmails] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched courses:', data);
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.error('Unexpected response format:', data);
          setCourses([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setCourses([]);
      });
  }, []);

  const fetchLearnerEmails = (courseId) => {
    fetch(`http://localhost:5000/api/learner/learners/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched learner emails:', data);
        if (Array.isArray(data)) {  
          setLearnerEmails(data);
        } else if (data.success && Array.isArray(data.data)) {
          setLearnerEmails(data.data);
        } else {
          console.error('Unexpected response format:', data);
          setLearnerEmails([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching learner emails:', error);
        setLearnerEmails([]);
      });
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    fetchLearnerEmails(courseId);
  };

  const handleSendMail = () => {
    if (!subject || !message || !selectedCourse) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }
    if (learnerEmails.length === 0) {
      setErrorMessage('No Learners found for the selected course.');
      return;
    }
    
    setIsSending(true); // Disable button
    console.log("Selected Course:", selectedCourse);
    console.log("Learner Emails:", learnerEmails);

    const emailParams = {
      subject,
      message,
      to_email: learnerEmails, // Send an array, not a string
    };

    emailjs
      .send('service_jtatsrq', 'template_44rrn4p', emailParams, '8TOkSAnsc4yfF81je')
      .then((response) => {
        console.log('Email sent successfully:', response);
        setSuccessMessage('Emails sent successfully!');
        setErrorMessage('');
        setSubject('');
        setMessage('');
        setSelectedCourse('');
        setLearnerEmails([]);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        setErrorMessage('Failed to send emails.');
      })
      .finally(() => {
        setIsSending(false); // Re-enable button
      });
  };

  return (
    <div className="admin-send-mail-container">
      <h1>Email Sending Form</h1>
      <div className="form-group">
        <label htmlFor="course">Select Course:</label>
        <select id="course" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
          <option value="">-- Select a Course --</option>
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No courses available
            </option>
          )}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Description:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your description"
        ></textarea>
      </div>
      <button className="send-mail-btn" onClick={handleSendMail} disabled={isSending}>
        {isSending ? "Sending..." : "Send Mail"}
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AdminSendMail;
