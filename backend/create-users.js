// Simple script to create test users
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

async function createUsers() {
  try {
    console.log('Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');

    // Create User model
    const User = mongoose.model('User', userSchema);

    // Clear existing users
    console.log('Clearing users collection...');
    await User.deleteMany({});
    console.log('Users collection cleared');

    // Create test users
    const users = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123'
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123'
      }
    ];

    console.log('Creating test users...');
    await User.create(users);
    console.log('Test users created successfully!');
    
    // Print credentials
    console.log('\nUser credentials:');
    console.log('1. Email: test1@example.com, Password: password123');
    console.log('2. Email: test2@example.com, Password: password123');

    // List all users
    const createdUsers = await User.find({}).select('-password');
    console.log('\nUsers in database:', createdUsers.map(u => ({ 
      id: u._id, 
      name: u.name, 
      email: u.email 
    })));

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createUsers(); 