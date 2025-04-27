import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  name: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
      };
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication invalid' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'default_secret'
    ) as JwtPayload;
    
    // Attach user to request
    req.user = {
      userId: payload.userId,
      name: payload.name,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication invalid' });
  }
};

export default auth; 