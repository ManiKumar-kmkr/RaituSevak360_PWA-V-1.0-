import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/environment';
import apiRoutes from './routes';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    app: 'RaituSevak360 Backend API',
    status: 'online',
    version: '1.0.0',
    health: '/api/health',
  });
});

// Mount central API router
app.use('/api', apiRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Central error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Backend Error]:', err.message);
  res.status(500).json({
    success: false,
    message: config.env === 'production' ? 'Internal server error' : err.message,
  });
});

// Start listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[RaituSevak360] Server listening on http://localhost:${config.port} in ${config.env} mode`);
  });
}

export default app;
