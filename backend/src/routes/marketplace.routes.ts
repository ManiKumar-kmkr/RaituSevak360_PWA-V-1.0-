import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/marketplace.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/products', getProducts);
router.post('/products', authenticateJwt, createProduct);

export default router;
