import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ICrop extends Document {
  farmId: Types.ObjectId;
  farmerId: Types.ObjectId;
  cropName: string;
  variety?: string;
  season: 'kharif' | 'rabi' | 'zaid';
  sowingDate: Date;
  expectedHarvestDate?: Date;
  areaInAcres: number;
  currentStage: 'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting' | 'completed';
  healthStatus: 'healthy' | 'at_risk' | 'diseased';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema = new Schema<ICrop>(
  {
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true, index: true },
    cropName: { type: String, required: true },
    variety: { type: String },
    season: { type: String, enum: ['kharif', 'rabi', 'zaid'], required: true },
    sowingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date },
    areaInAcres: { type: Number, required: true },
    currentStage: {
      type: String,
      enum: ['sowing', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'completed'],
      default: 'sowing',
    },
    healthStatus: {
      type: String,
      enum: ['healthy', 'at_risk', 'diseased'],
      default: 'healthy',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const CropModel: Model<ICrop> =
  mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema);
