import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IFarmer extends Document {
  userId: Types.ObjectId;
  aadhaarNumber?: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  totalLandAcres: number;
  primaryCrops: string[];
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    aadhaarNumber: { type: String },
    village: { type: String, required: true },
    mandal: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    totalLandAcres: { type: Number, default: 0 },
    primaryCrops: [{ type: String }],
    preferredLanguage: { type: String, default: 'te' },
  },
  { timestamps: true }
);

export const FarmerModel: Model<IFarmer> =
  mongoose.models.Farmer || mongoose.model<IFarmer>('Farmer', FarmerSchema);
