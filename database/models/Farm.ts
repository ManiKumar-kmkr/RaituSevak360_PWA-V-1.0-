import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IFarm extends Document {
  farmerId: Types.ObjectId;
  farmName: string;
  surveyNumber?: string;
  sizeInAcres: number;
  soilType: string;
  irrigationSource: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true, index: true },
    farmName: { type: String, required: true },
    surveyNumber: { type: String },
    sizeInAcres: { type: Number, required: true },
    soilType: { type: String, required: true },
    irrigationSource: { type: String, default: 'borewell' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FarmSchema.index({ location: '2dsphere' });

export const FarmModel: Model<IFarm> =
  mongoose.models.Farm || mongoose.model<IFarm>('Farm', FarmSchema);
