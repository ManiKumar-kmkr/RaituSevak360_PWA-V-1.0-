import { NotificationModel, INotification } from '../../../database/models/Notification';

export class NotificationService {
  async getUserNotifications(userId: string) {
    return NotificationModel.find({ recipientId: userId }).sort({ createdAt: -1 });
  }

  async sendNotification(data: Partial<INotification>) {
    const notification = await NotificationModel.create(data);
    // Hook for Firebase Cloud Messaging (FCM) dispatch
    return notification;
  }

  async markAsRead(notificationId: string) {
    return NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }
}

export const notificationService = new NotificationService();
