import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ISoil extends Document {
  farmId: Types.ObjectId;
  farmerId: Types.ObjectId;
  testDate: Date;
  phLevel: number;
  nitrogen: number; // N in kg/ha
  phosphorus: number; // P in kg/ha
  potassium: number; // K in kg/ha
  organicCarbonPercentage?: number;
  moisturePercentage?: number;
  soilTexture: string; // e.g. clay, sandy, loamy, black, red
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SoilSchema = new Schema<ISoil>(
  {
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    testDate: { type: Date, default: Date.now },
    phLevel: { type: Number, required: true },
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    organicCarbonPercentage: { type: Number },
    moisturePercentage: { type: Number },
    soilTexture: { type: String, required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

export const SoilModel: Model<ISoil> =
  mongoose.models.Soil || mongoose.model<ISoil>('Soil', SoilSchema);
