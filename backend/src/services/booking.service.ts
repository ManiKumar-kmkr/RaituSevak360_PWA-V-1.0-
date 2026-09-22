import { BookingModel, IBooking } from '../../../database/models/Booking';

export class BookingService {
  async getFarmerBookings(farmerId: string) {
    return BookingModel.find({ farmerId }).sort({ createdAt: -1 });
  }

  async createBooking(farmerId: string, bookingData: Partial<IBooking>) {
    return BookingModel.create({
      ...bookingData,
      farmerId,
      status: 'pending',
    });
  }

  async updateBookingStatus(bookingId: string, status: IBooking['status']) {
    return BookingModel.findByIdAndUpdate(bookingId, { status }, { new: true });
  }
}

export const bookingService = new BookingService();
