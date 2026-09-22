import mongoose, { Document, Schema, Model } from 'mongoose';

export enum UserRole {
  FARMER = 'farmer',
  LABOUR = 'labour',
  MACHINERY_PROVIDER = 'machinery_provider',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  phoneNumber: string;
  name: string;
  role: UserRole;
  language: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.FARMER },
    language: { type: String, default: 'te' }, // default Telugu / regional
    avatarUrl: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
