import axios from 'axios';

const ADMIN_API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:5000/api';

export const adminClient = axios.create({
  baseURL: ADMIN_API_BASE,
});

export const adminApi = {
  getOverviewMetrics: async () => {
    return {
      activeFarmers: 12480,
      cultivatedAcres: 45210,
      totalBookings: 3892,
      aiQueries: 89450,
    };
  },
};
