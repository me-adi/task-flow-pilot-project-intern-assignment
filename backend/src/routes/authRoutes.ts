import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { body } from 'express-validator';
import auth from '../middleware/auth';

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('name')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  login
);

// Get current user route (protected)
router.get('/me', auth, getCurrentUser);

export default router; 