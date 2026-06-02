import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setUseMockDb } from '../models';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/tutorcrm';

export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('⚡ Connected to MongoDB successfully.');
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB. Service may not be running locally.');
    setUseMockDb(true);
  }
};
