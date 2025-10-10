import axios from '../lib/axios';
import { Cab } from '../types';

export interface CabFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  fuel_type?: string;
  expiring_documents?: boolean;
}

export const cabService = {
  getAll: async (params?: CabFilters) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        const filterKey = key as keyof CabFilters;
        if (params[filterKey] !== '' && params[filterKey] !== null && params[filterKey] !== undefined) {
          cleanParams[filterKey] = params[filterKey];
        }
      });
    }
    const { data } = await axios.get('/cabs', { params: cleanParams });
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
