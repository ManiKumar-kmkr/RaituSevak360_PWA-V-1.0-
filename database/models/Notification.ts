import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  title: string;
  message: string;
  type: 'weather_alert' | 'crop_advisory' | 'booking_update' | 'order_update' | 'marketplace_inquiry' | 'general';
  data?: Record<string, any>;
  isRead: boolean;
  sentViaFCM: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['weather_alert', 'crop_advisory', 'booking_update', 'order_update', 'marketplace_inquiry', 'general'],
      default: 'general',
    },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    sentViaFCM: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
