import { apiClient } from './api';

export const weatherApi = {
  getWeather: async (district = 'Karimnagar') => {
    const res = await apiClient.get('/weather', { params: { district } });
    return res.data;
  },
};

export const soilApi = {
  getSoilReports: async (farmId: string) => {
    const res = await apiClient.get(`/soil/farm/${farmId}`);
    return res.data;
  },
};

export const aiApi = {
  getAdvisory: async (payload: { cropName: string; stage: string; soilType: string; location: string }) => {
    const res = await apiClient.post('/ai/crop-advisory', payload);
    return res.data;
  },
  detectDisease: async (imageData: string, cropType: string) => {
    const res = await apiClient.post('/ai/detect-disease', { imageData, cropType });
    return res.data;
  },
  chat: async (query: string, context?: any) => {
    const res = await apiClient.post('/ai/chat', { query, context });
    return res.data;
  },
};

export const labourApi = {
  getAvailable: async (params?: { district?: string; skill?: string }) => {
    const res = await apiClient.get('/labour', { params });
    return res.data;
  },
};

export const machineryApi = {
  getAvailable: async (params?: { type?: string; district?: string }) => {
    const res = await apiClient.get('/machinery', { params });
    return res.data;
  },
};

export const marketplaceApi = {
  getProducts: async (params?: { category?: string; district?: string }) => {
    const res = await apiClient.get('/marketplace/products', { params });
    return res.data;
  },
};
