import mongoose from 'mongoose';

/**
 * MongoDB connection helper using Mongoose for RaituSevak360.
 */
export const connectDatabase = async (uri?: string): Promise<typeof mongoose> => {
  const connectionUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/raitusevak360';

  try {
    const conn = await mongoose.connect(connectionUri, {
      autoIndex: true,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('[MongoDB] Disconnected.');
};
