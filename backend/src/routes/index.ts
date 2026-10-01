import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Mount authentication routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'RaituSevak360 Backend Service is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root API information
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'RaituSevak360 REST API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      farmers: '/api/farmers',
      crops: '/api/crops',
      weather: '/api/weather',
      soil: '/api/soil',
      labour: '/api/labour',
      machinery: '/api/machinery',
      marketplace: '/api/marketplace',
      notifications: '/api/notifications',
    },
  });
});

export default router;
