const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: 'Too many login attempts, please try again after 10 minutes'
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

// Admin User Management Routes
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/role', protect, authorize('ADMIN'), updateUserRole);

module.exports = router;
