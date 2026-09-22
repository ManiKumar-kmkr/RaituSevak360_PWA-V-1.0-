import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notification.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJwt, getNotifications);
router.patch('/:id/read', authenticateJwt, markRead);

export default router;
