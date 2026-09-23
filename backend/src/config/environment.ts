import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/raitusevak360',
  jwt: {
    secret: process.env.JWT_SECRET || 'raitusevak360-default-development-secret-key-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.FRONTEND_API_URL || '*',
  },
  aiApiUrl: process.env.AI_API_URL || 'http://localhost:8000/api/v1',
};

export default config;
