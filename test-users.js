// Simple Node.js script to create test users
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Set up paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, 'backend', '.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';

// User schema (simplified version of our User model)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
}, { timestamps: true });

async function createTestUsers() {
  try {
    console.log('Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');

    // Define User model
    const User = mongoose.model('User', userSchema);
    
    // Clear existing users
    console.log('Clearing users collection...');
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    // Create test users
    const password = await bcrypt.hash('password123', 10);
    
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password
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
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit();
  }
}

createTestUsers(); 