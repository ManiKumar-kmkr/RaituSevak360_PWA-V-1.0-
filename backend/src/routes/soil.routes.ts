import { Router } from 'express';
import { getSoilReports, addSoilReport } from '../controllers/soil.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/farm/:farmId', authenticateJwt, getSoilReports);
router.post('/', authenticateJwt, addSoilReport);

export default router;
