import { Router } from 'express';
import { getLabour, registerLabour } from '../controllers/labour.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getLabour);
router.post('/', authenticateJwt, registerLabour);

export default router;
