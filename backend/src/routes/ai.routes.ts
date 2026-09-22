import { Router } from 'express';
import { getAdvisory, detectDisease, chatAssistant } from '../controllers/ai.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.post('/crop-advisory', authenticateJwt, getAdvisory);
router.post('/detect-disease', authenticateJwt, detectDisease);
router.post('/chat', authenticateJwt, chatAssistant);

export default router;
