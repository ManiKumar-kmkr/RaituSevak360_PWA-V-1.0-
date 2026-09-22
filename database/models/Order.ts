import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online' | 'upi';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      addressLine: { type: String, required: true },
      village: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
      default: 'placed',
    },
    paymentMethod: { type: String, enum: ['cod', 'online', 'upi'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
