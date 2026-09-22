import { Router } from 'express';
import { getBookings, createBooking } from '../controllers/booking.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJwt, getBookings);
router.post('/', authenticateJwt, createBooking);

export default router;
