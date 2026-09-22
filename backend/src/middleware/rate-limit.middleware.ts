import { Request, Response, NextFunction } from 'express';

// In-memory rate limiting map for basic sliding window protection
const requestMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (options = { windowMs: 60 * 1000, maxRequests: 100 }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'anonymous';
    const currentTime = Date.now();

    const record = requestMap.get(ip);

    if (!record || currentTime > record.resetTime) {
      requestMap.set(ip, {
        count: 1,
        resetTime: currentTime + options.windowMs,
      });
      next();
      return;
    }

    if (record.count >= options.maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
      return;
    }

    record.count += 1;
    next();
  };
};
