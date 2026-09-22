import { Router } from 'express';
import {
  getFarmerCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/crop.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJwt, getFarmerCrops);
router.get('/:id', authenticateJwt, getCropById);
router.post('/', authenticateJwt, createCrop);
router.put('/:id', authenticateJwt, updateCrop);
router.delete('/:id', authenticateJwt, deleteCrop);

export default router;
