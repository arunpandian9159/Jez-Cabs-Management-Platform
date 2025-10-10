import axios from '../lib/axios';
import { DashboardStats } from '../types';

export interface RevenueData {
  date: string;
  revenue: number;
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await axios.get('/analytics/dashboard');
    return data;
  },

  getRevenueOverTime: async (params?: { startDate?: string; endDate?: string }): Promise<RevenueData[]> => {
    const { data } = await axios.get('/analytics/revenue-over-time', { params });
    return data;
  },

  getFleetUtilization: async (params?: { startDate?: string; endDate?: string }) => {
    const { data } = await axios.get('/analytics/fleet-utilization', { params });
    return data;
  },

  getBookingTrends: async (params?: { startDate?: string; endDate?: string }) => {
    const { data } = await axios.get('/analytics/booking-trends', { params });
    return data;
  },
};
