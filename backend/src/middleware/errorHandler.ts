import { Request, Response, NextFunction } from 'express';

// Custom error class
export class CustomError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Not found middleware
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

// Error handler middleware
export const errorHandlerMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);
  
  // Check if error is our custom error
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  
  // Check for mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
    return;
  }
  
  // Check for mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(400).json({ 
      message: `Duplicate value entered for ${Object.keys((err as any).keyValue)} field` 
    });
    return;
  }
  
  res.status(500).json({ message: 'Something went wrong, please try again' });
}; 