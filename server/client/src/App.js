import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './styles/components/Navbar';
import Footer from './styles/components/Footer';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import About from './pages/About/About';
import FAQ from './pages/FAQ/FAQ';
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy'; 
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/Learner/SignUp';
import CourseDetails from './pages/CourseDetails/CourseDetails';
import TrainerSignUp from './pages/SignUp/Trainer/TrainerSignUp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'; 
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import AdminHome from './pages/AdminDashboard/AdminHome/AdminHome';
import AddCourse from './pages/AdminDashboard/AdminHome/AddCourse';
import AdminSendMail from './pages/AdminDashboard/AdminSendMail/AdminSendMail';
import AdminFAQ from './pages/AdminDashboard/AdminFAQ/AdminFAQ';
import AdminCourses from './pages/AdminDashboard/AdminCourses/AdminCourses';
import AdminAbout from './pages/AdminDashboard/AdminAbout/AdminAbout';
import LearnerHome from './pages/LearnerDashboard/LearnerHome/LearnerHome';
import LearnerProfile from './pages/LearnerDashboard/LearnerProfile/LearnerProfile';
import LEditAccount from './pages/LearnerDashboard/LearnerProfile/LEditAccount';
import LearnerFAQ from './pages/LearnerDashboard/LearnerFAQ/LearnerFAQ';
import LearnerCourses from './pages/LearnerDashboard/LearnerCourses/LearnerCourses';
import LearnerAbout from './pages/LearnerDashboard/LearnerAbout/LearnerAbout';
import TrainerHome from './pages/TrainerDashboard/TrainerHome/TrainerHome';
import TAddCourses from './pages/TrainerDashboard/TrainerHome/TAddCourses';
import TrainerProfile from './pages/TrainerDashboard/TrainerProfile/TrainerProfile';
import TrainerAbout from './pages/TrainerDashboard/TrainerAbout/TrainerAbout';
import TrainerCourses from './pages/TrainerDashboard/TrainerCourses/TrainerCourses';
import TrainerFAQ from './pages/TrainerDashboard/TrainerFAQ/TrainerFAQ';
import TEditAccount from './pages/TrainerDashboard/TrainerProfile/TEditAccount';
import CourseContent from './pages/TrainerDashboard/TrainerHome/CourseContent';
import EditCourse from './pages/TrainerDashboard/TrainerHome/EditCourse';
import UploadChaptersAndLessons from './pages/TrainerDashboard/TrainerHome/UploadChaptersAndLessons';
import AddQuiz from "./pages/TrainerDashboard/TrainerHome/AddQuiz";
import CourseInteraction from "./pages/CourseInteraction/CourseInteraction";
import MicrosoftLogin from "./pages/Login/MicrosoftLogin";

import { fetchTestMessage } from './utils/api';

function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));
  const [isLearner, setIsLearner] = useState(!!localStorage.getItem('learnerToken'));
  const [isTrainer, setIsTrainer] = useState(!!localStorage.getItem('trainerToken'));
  const [backendMessage, setBackendMessage] = useState(null);

  useEffect(() => {
    const updateAuth = () => {
      setIsAdmin(!!localStorage.getItem('adminToken'));
      setIsLearner(!!localStorage.getItem('learnerToken'));
      setIsTrainer(!!localStorage.getItem('trainerToken'));
    };
    window.addEventListener('storage', updateAuth);
    const interval = setInterval(updateAuth, 500);
    return () => {
      window.removeEventListener('storage', updateAuth);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const getBackendMessage = async () => {
      const message = await fetchTestMessage();
      setBackendMessage(message ? message.message : 'Failed to fetch data');
    };
    getBackendMessage();
  }, []);

  return (
    <>
      <Navbar isAdmin={isAdmin} isTrainer={isTrainer} isLearner={isLearner} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/microsoft-login" element={<MicrosoftLogin />} />
        <Route path="/course-details/:courseId" element={<CourseDetails />} />
        <Route path="/trainer-signup" element={<TrainerSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/course-interaction/:courseId" element={<CourseInteraction />} />

        {/* Display backend message */}
        <Route
          path="/api-test"
          element={
            <div>
              <h1>Backend API Test</h1>
              <p>{backendMessage}</p>
            </div>
          }
        />

        {/* Admin Routes */}
        {isAdmin && (
          <>
            <Route path="/admin-dashboard" element={<AdminHome />} />
            <Route path="/admin/add-course" element={<AddCourse />} />
            <Route path="/admin/send-mail" element={<AdminSendMail />} />
            <Route path="/admin/faq" element={<AdminFAQ />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/about" element={<AdminAbout />} />
          </>
        )}

        {/* Learner Routes */}
        {isLearner && (
          <>
            <Route path="/learner-dashboard" element={<LearnerHome />} />
            <Route path="/learner-dashboard/profile" element={<LearnerProfile />} />
            <Route path="/learner-dashboard/profile/editaccount" element={<LEditAccount />} />
            <Route path="/learner-dashboard/faq" element={<LearnerFAQ />} />
            <Route path="/learner-dashboard/courses" element={<LearnerCourses />} />
            <Route path="/learner-dashboard/about" element={<LearnerAbout />} />
          </>
        )}

        {/* Trainer Routes */}
        {isTrainer && (
          <>
            <Route path="/trainer-dashboard" element={<TrainerHome />} />
            <Route path="/add-course" element={<TAddCourses />} />
            <Route path="/course/edit/:courseId" element={<EditCourse />} />
            <Route path="/course/upload/:courseId" element={<UploadChaptersAndLessons />} />
            <Route path="/course/addquiz/:courseId" element={<AddQuiz />} />
            <Route path="/trainer-dashboard/course-content/:courseId" element={<CourseContent />} />
            <Route path="/trainer-dashboard/profile" element={<TrainerProfile />} />
            <Route path="/trainer-dashboard/profile/editaccount" element={<TEditAccount />} />
            <Route path="/trainer-dashboard/about" element={<TrainerAbout />} />
            <Route path="/trainer-dashboard/courses" element={<TrainerCourses />} />
            <Route path="/trainer-dashboard/faq" element={<TrainerFAQ />} />
          </>
        )}

        {/* Redirect to SignIn if route doesn't exist */}
        <Route path="*" element={<Navigate to={isLearner ? "/learner-dashboard" : isAdmin ? "/admin-dashboard" : isTrainer ? "/trainer-dashboard" : "/signin"} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;