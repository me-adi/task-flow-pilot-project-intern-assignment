import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-flow';
    
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    
    // List collections - fixed to handle undefined db
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      console.log('Available collections:', collections.map(c => c.collectionName));
    } else {
      console.log('No database connection available');
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export the mongoose connection for use in other files
export const db = mongoose.connection;

export default connectDB; 