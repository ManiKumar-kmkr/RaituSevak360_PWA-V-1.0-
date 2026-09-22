import { Router } from 'express';
import { createOrder } from '../controllers/order.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJwt, createOrder);

export default router;
