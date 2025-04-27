import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from '../middleware/errorHandler';
import db from '../services/inMemoryDb';

// Get all tasks for the authenticated user
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }

    // Optional query parameters for filtering
    const { status, priority, search } = req.query;
    
    // Get tasks
    const tasks = await db.getTasks(req.user.userId, { status, priority, search });
    
    res.status(200).json({ tasks, count: tasks.length });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array()[0].msg, 400);
    }

    const { title, description, priority } = req.body;
    
    // Create task
    const task = await db.createTask({
      title,
      description,
      priority: priority || 'Medium',
      userId: req.user.userId
    });
    
    res.status(201).json({ task });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Get a single task by ID
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }
    
    const { id } = req.params;
    
    // Get task
    const task = await db.getTaskById(id, req.user.userId);
    
    if (!task) {
      throw new CustomError('Task not found', 404);
    }
    
    res.status(200).json({ task });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array()[0].msg, 400);
    }
    
    const { id } = req.params;
    
    // Check if task exists and belongs to user
    const task = await db.getTaskById(id, req.user.userId);
    
    if (!task) {
      throw new CustomError('Task not found', 404);
    }
    
    // Update task
    const updatedTask = await db.updateTask(id, req.user.userId, req.body);
    
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }
    
    const { id } = req.params;
    
    // Check if task exists and belongs to user
    const task = await db.getTaskById(id, req.user.userId);
    
    if (!task) {
      throw new CustomError('Task not found', 404);
    }
    
    // Delete task
    await db.deleteTask(id, req.user.userId);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}; 