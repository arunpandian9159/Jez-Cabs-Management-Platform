import axios from '../lib/axios';
import { Cab } from '../types';

export interface CabFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const cabService = {
  getAll: async (params?: CabFilters) => {
    const { data } = await axios.get('/cabs', { params });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get(`/cabs/${id}`);
    return data;
  },

  create: async (cab: Partial<Cab>) => {
    const { data } = await axios.post('/cabs', cab);
    return data;
  },

  update: async (id: string, cab: Partial<Cab>) => {
    const { data } = await axios.patch(`/cabs/${id}`, cab);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`/cabs/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await axios.patch(`/cabs/${id}/status`, { status });
    return data;
  },
};
