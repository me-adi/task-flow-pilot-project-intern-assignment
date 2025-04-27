import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const createTestUsers = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';
    
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // Clear existing users
    console.log('Clearing users collection...');
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    // Create test users
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: await bcrypt.hash('password123', 10)
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: await bcrypt.hash('password123', 10)
      }
    ];
    
    console.log('Creating test users...');
    await User.create(testUsers);
    console.log('Test users created successfully:');
    console.log('1. Email: test1@example.com, Password: password123');
    console.log('2. Email: test2@example.com, Password: password123');
    
    // List users to confirm
    const users = await User.find({}).select('-password');
    console.log('Users in database:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    process.exit();
  }
};

// Run the function
createTestUsers(); 