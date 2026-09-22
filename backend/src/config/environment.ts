import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/raitusevak360',
  JWT_SECRET: process.env.JWT_SECRET || 'raitusevak360_super_secret_jwt_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_API_URL: process.env.AI_API_URL || 'http://localhost:8000/api/v1',
  CORS_ORIGINS: [
    'http://localhost:3000', // Frontend PWA
    'http://localhost:3001', // Admin Portal
  ],
};
