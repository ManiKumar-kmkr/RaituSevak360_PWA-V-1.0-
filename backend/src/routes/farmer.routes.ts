import { Router } from 'express';
import { getProfile, updateProfile, getFarms } from '../controllers/farmer.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticateJwt, getProfile);
router.put('/profile', authenticateJwt, updateProfile);
router.get('/farms', authenticateJwt, getFarms);

export default router;
