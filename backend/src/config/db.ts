import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB connection string is not defined in environment variables');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      // These options help with connection issues
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
      socketTimeoutMS: 60000, // Increase socket timeout to 60s
      family: 4, // Force IPv4
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      if ('cause' in error) {
        console.error('Cause:', (error as any).cause);
      }
    }
    process.exit(1);
  }
};

export default connectDB;
