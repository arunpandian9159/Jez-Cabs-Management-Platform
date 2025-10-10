import axios from '../lib/axios';
import { Driver } from '../types';

export interface DriverFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const driverService = {
  getAll: async (params?: DriverFilters) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      Object.keys(params).forEach((key) => {
        const filterKey = key as keyof DriverFilters;
        if (params[filterKey] !== '' && params[filterKey] !== null && params[filterKey] !== undefined) {
          cleanParams[filterKey] = params[filterKey];
        }
      });
    }
    const { data } = await axios.get('/drivers', { params: cleanParams });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get(`/drivers/${id}`);
    return data;
  },

  create: async (driver: Partial<Driver>) => {
    const { data } = await axios.post('/drivers', driver);
    return data;
  },

  update: async (id: string, driver: Partial<Driver>) => {
    const { data } = await axios.patch(`/drivers/${id}`, driver);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`/drivers/${id}`);
    return data;
  },

  toggleActive: async (id: string) => {
    const { data } = await axios.patch(`/drivers/${id}/toggle-active`);
    return data;
  },
};
