import mongoose from 'mongoose';
import { env } from './environment';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Backend Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Backend Database] Connection Error:', error);
    process.exit(1);
  }
};
