import { Router } from 'express';
import { getMachinery, registerMachinery } from '../controllers/machinery.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getMachinery);
router.post('/', authenticateJwt, registerMachinery);

export default router;
