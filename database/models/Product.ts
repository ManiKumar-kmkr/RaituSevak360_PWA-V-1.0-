import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IProduct extends Document {
  sellerId: Types.ObjectId; // Farmer or Agri-vendor User
  name: string;
  category: 'seeds' | 'fertilizers' | 'pesticides' | 'produce' | 'tools';
  description: string;
  pricePerUnit: number;
  unit: string; // e.g. 'kg', 'quintal', 'litre', 'packet'
  availableQuantity: number;
  images: string[];
  location: {
    village: string;
    district: string;
    state: string;
  };
  isOrganic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['seeds', 'fertilizers', 'pesticides', 'produce', 'tools'],
      required: true,
    },
    description: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    unit: { type: String, required: true },
    availableQuantity: { type: Number, required: true },
    images: [{ type: String }],
    location: {
      village: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
    },
    isOrganic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
