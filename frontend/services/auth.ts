import { apiClient } from './api';

export const authApi = {
  register: async (data: { phoneNumber: string; name: string; role?: string }) => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  sendOtp: async (phoneNumber: string) => {
    const res = await apiClient.post('/auth/send-otp', { phoneNumber });
    return res.data;
  },
  verifyOtp: async (phoneNumber: string, otp: string) => {
    const res = await apiClient.post('/auth/verify-otp', { phoneNumber, otp });
    return res.data;
  },
};
