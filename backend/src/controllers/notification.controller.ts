import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const notifications = await notificationService.getUserNotifications(userId);
    sendSuccess(res, notifications, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id);
    sendSuccess(res, updated, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};
