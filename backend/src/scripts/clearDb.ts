import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import Task from '../models/Task';

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';
    
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // Clear users
    console.log('Clearing users collection...');
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);
    
    // Clear tasks
    console.log('Clearing tasks collection...');
    const taskResult = await Task.deleteMany({});
    console.log(`Deleted ${taskResult.deletedCount} tasks`);
    
    console.log('Database cleared successfully');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    process.exit();
  }
};

// Run the function
clearDatabase(); 