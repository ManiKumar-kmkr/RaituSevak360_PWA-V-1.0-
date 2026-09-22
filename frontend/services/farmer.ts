import { apiClient } from './api';

export const farmerApi = {
  getProfile: async () => {
    const res = await apiClient.get('/farmers/profile');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await apiClient.put('/farmers/profile', data);
    return res.data;
  },
  getFarms: async () => {
    const res = await apiClient.get('/farmers/farms');
    return res.data;
  },
};
