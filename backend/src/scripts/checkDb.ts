import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load environment variables
dotenv.config();

const checkDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';
    
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // Check collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      console.log('Available collections:', collections.map(c => c.collectionName));
    } else {
      console.log('No database connection available');
    }
    
    // Check users
    const users = await User.find({}).select('-password');
    console.log('Total users:', users.length);
    
    if (users.length > 0) {
      console.log('List of users:');
      users.forEach(user => {
        console.log(`- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}`);
      });
    } else {
      console.log('No users found in database');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit();
  }
};

// Run the function
checkDatabase(); 