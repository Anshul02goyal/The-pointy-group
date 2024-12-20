const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// User routes
router.post('/register', register); // Register user
router.post('/login', login);       // Login user
router.post('/logout', protect, logout); // Logout user (requires token for blacklist)

module.exports = router;
