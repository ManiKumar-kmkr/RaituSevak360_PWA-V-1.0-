import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/environment';

export interface AuthenticatedUserPayload {
  id: string;
  mobile: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUserPayload;
};

/**
 * Authentication middleware that verifies JWT Bearer token
 * and attaches decoded user identity to req.user.
 * Rejects requests without valid tokens with 401 Unauthorized.
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Missing Bearer token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is empty.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    const isExpired = err instanceof jwt.TokenExpiredError;
    res.status(401).json({
      success: false,
      message: isExpired
        ? 'Session expired. Please log in again.'
        : 'Invalid authentication token.',
    });
  }
}

export default authMiddleware;
