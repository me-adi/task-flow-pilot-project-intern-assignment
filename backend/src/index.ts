import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { notFoundMiddleware, errorHandlerMiddleware } from './middleware/errorHandler';
import db from './services/inMemoryDb';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Log that we're using in-memory database
console.log('Using in-memory database');
console.log('Test users available:');
console.log('1. Email: test1@example.com, Password: password123');
console.log('2. Email: test2@example.com, Password: password123');

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middlewares
app.use(notFoundMiddleware);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandlerMiddleware(err, req, res, next);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 