import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IBooking extends Document {
  farmerId: Types.ObjectId;
  bookingType: 'labour' | 'machinery';
  serviceRefId: Types.ObjectId; // References Labour or Machinery
  startDate: Date;
  endDate: Date;
  totalUnits: number; // hours or days or worker-count
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true, index: true },
    bookingType: { type: String, enum: ['labour', 'machinery'], required: true },
    serviceRefId: { type: Schema.Types.ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalUnits: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const BookingModel: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
