import express from 'express';
import {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import { body } from 'express-validator';
import auth from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all tasks and create task
router
  .route('/')
  .get(getAllTasks)
  .post(
    [
      body('title')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
      body('description')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot be more than 1000 characters'),
      body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High')
    ],
    createTask
  );

// Get, update, and delete task by ID
router
  .route('/:id')
  .get(getTask)
  .patch(
    [
      body('title')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
      body('description')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ max: 1000 })
        .withMessage('Description cannot be more than 1000 characters'),
      body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),
      body('status')
        .optional()
        .isIn(['Active', 'Completed'])
        .withMessage('Status must be Active or Completed')
    ],
    updateTask
  )
  .delete(deleteTask);

export default router; 