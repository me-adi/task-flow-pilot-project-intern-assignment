import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { CustomError } from '../middleware/errorHandler';
import db from '../services/inMemoryDb';
import bcrypt from 'bcryptjs';

// Generate JWT
const createToken = (userId: string, name: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = process.env.JWT_LIFETIME || '1d';
  
  return jwt.sign(
    { userId, name },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array()[0].msg, 400);
    }

    const { name, email, password } = req.body;
    
    console.log(`Registration attempt for email: ${email}`);

    // Create user
    try {
      const user = await db.createUser(name, email, password);
      console.log(`User created with ID: ${user.id}`);
      
      // Generate token
      const token = createToken(user.id, user.name);
      
      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      if (error.message && error.message.includes('already exists')) {
        throw new CustomError('User with this email already exists', 400);
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Check if user exists
    const user = await db.findUserByEmail(email);
    if (!user) {
      console.log(`Email ${email} not found in database`);
      throw new CustomError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log(`Invalid password for email: ${email}`);
      throw new CustomError('Invalid credentials', 401);
    }

    console.log(`Successful login for user: ${user.id}`);
    
    // Generate token
    const token = createToken(user.id, user.name);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication error', 401);
    }
    
    const user = await db.findUserById(req.user.userId);
    
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error during user retrieval' });
    }
  }
}; 