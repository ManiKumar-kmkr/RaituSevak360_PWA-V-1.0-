import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/environment';
import { connectDB } from './config/database';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rate-limit.middleware';

const app = express();

// Database Connection
connectDB();

// Core Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or allowed web origins
      if (!origin || env.CORS_ORIGINS.includes(origin) || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting
app.use('/api', rateLimiter());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RaituSevak360 Backend API',
    version: '1.0.0',
  });
});

// Mount All API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 [RaituSevak360 Server] Running on http://localhost:${PORT}`);
  console.log(`📡 [API Base] http://localhost:${PORT}/api`);
});

export default app;
