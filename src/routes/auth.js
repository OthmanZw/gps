const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

module.exports = router; 