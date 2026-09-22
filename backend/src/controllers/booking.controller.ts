import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/response';

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.user?.id as string;
    const bookings = await bookingService.getFarmerBookings(farmerId);
    sendSuccess(res, bookings, 'Bookings retrieved');
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const farmerId = req.user?.id as string;
    const booking = await bookingService.createBooking(farmerId, req.body);
    sendSuccess(res, booking, 'Booking created', 201);
  } catch (error) {
    next(error);
  }
};
