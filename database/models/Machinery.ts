import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IMachinery extends Document {
  ownerId: Types.ObjectId;
  machineryType: 'tractor' | 'harvester' | 'drone' | 'tiller' | 'seeder' | 'sprayer';
  modelName: string;
  hourlyRate: number;
  dailyRate?: number;
  isAvailable: boolean;
  location: {
    village: string;
    mandal: string;
    district: string;
    coordinates?: [number, number];
  };
  photos: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const MachinerySchema = new Schema<IMachinery>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    machineryType: {
      type: String,
      enum: ['tractor', 'harvester', 'drone', 'tiller', 'seeder', 'sprayer'],
      required: true,
    },
    modelName: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    dailyRate: { type: Number },
    isAvailable: { type: Boolean, default: true },
    location: {
      village: { type: String, required: true },
      mandal: { type: String, required: true },
      district: { type: String, required: true },
      coordinates: { type: [Number] },
    },
    photos: [{ type: String }],
    rating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

export const MachineryModel: Model<IMachinery> =
  mongoose.models.Machinery || mongoose.model<IMachinery>('Machinery', MachinerySchema);
