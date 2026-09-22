import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ILabour extends Document {
  userId: Types.ObjectId;
  fullName: string;
  skills: string[]; // harvesting, sowing, pesticide spraying, weeding
  dailyWageRate: number;
  location: {
    village: string;
    mandal: string;
    district: string;
    coordinates?: [number, number];
  };
  availabilityStatus: 'available' | 'booked' | 'unavailable';
  rating: number;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabourSchema = new Schema<ILabour>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    skills: [{ type: String, required: true }],
    dailyWageRate: { type: Number, required: true },
    location: {
      village: { type: String, required: true },
      mandal: { type: String, required: true },
      district: { type: String, required: true },
      coordinates: { type: [Number] },
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'booked', 'unavailable'],
      default: 'available',
    },
    rating: { type: Number, default: 5.0 },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const LabourModel: Model<ILabour> =
  mongoose.models.Labour || mongoose.model<ILabour>('Labour', LabourSchema);
