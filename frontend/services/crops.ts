import { apiClient } from './api';

export const cropsApi = {
  getAll: async () => {
    const res = await apiClient.get('/crops');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/crops/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post('/crops', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await apiClient.put(`/crops/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/crops/${id}`);
    return res.data;
  },
};
