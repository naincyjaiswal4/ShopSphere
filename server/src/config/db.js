import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedProductsIfEmpty } from '../utils/seedProducts.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);

    // Auto-seed sample products if database collection is empty
    await seedProductsIfEmpty();

    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    // In production/dev, we log the error and allow graceful operation or retry
  }
};

export default connectDB;
