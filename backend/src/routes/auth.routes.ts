import { Router } from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

// Protected Endpoints (Requires valid JWT Bearer token)
router.get('/me', authMiddleware, authController.getMe);
router.post('/role', authMiddleware, authController.updateRole);
router.post('/switch-role', authMiddleware, authController.switchRole);
router.post('/logout', authMiddleware, authController.logout);

export default router;
