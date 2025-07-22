const express = require('express');
const { adminLogin, learnerLogin, trainerLogin, resetPassword, checkUserRole } = require('../controllers/authControllers'); // Correct path

const router = express.Router();

// Admin Login Route
router.post('/admin-login', adminLogin);

// Learner login route
router.post('/learner-login', learnerLogin);

// Trainer Login Route
router.post('/trainer-login', trainerLogin);

// Forgot password route
//router.post('/forgot-password', forgotPassword);

// Reset password route (with token)
router.post('/reset-password', resetPassword);

// Check user role route
router.post('/check-user-role', checkUserRole);

module.exports = router;
