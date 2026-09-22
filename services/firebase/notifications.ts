import { fcmService } from './fcm';

export class NotificationIntegrationService {
  async dispatchWeatherAlert(farmerToken: string, alertText: string) {
    return fcmService.sendPushNotification({
      token: farmerToken,
      title: '🚨 Weather Alert / వాతావరణ హెచ్చరిక',
      body: alertText,
      data: { type: 'WEATHER_ALERT' },
    });
  }

  async dispatchAdvisoryNotification(farmerToken: string, crop: string, message: string) {
    return fcmService.sendPushNotification({
      token: farmerToken,
      title: `🌱 Crop Advisory: ${crop}`,
      body: message,
      data: { type: 'CROP_ADVISORY' },
    });
  }
}

export const notificationIntegration = new NotificationIntegrationService();
