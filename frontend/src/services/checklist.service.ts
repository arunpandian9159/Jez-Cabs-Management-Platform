import axios from '../lib/axios';
import { Checklist } from '../types';

export interface ChecklistFilters {
  cabId?: string;
  bookingId?: string;
  isComplete?: boolean;
  isApproved?: boolean;
  page?: number;
  limit?: number;
}

export const checklistService = {
  getAll: async (params?: ChecklistFilters) => {
    const { data } = await axios.get('/checklists', { params });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get(`/checklists/${id}`);
    return data;
  },

  create: async (checklist: Partial<Checklist>) => {
    const { data } = await axios.post('/checklists', checklist);
    return data;
  },

  update: async (id: string, checklist: Partial<Checklist>) => {
    const { data } = await axios.patch(`/checklists/${id}`, checklist);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`/checklists/${id}`);
    return data;
  },

  approve: async (id: string) => {
    const { data } = await axios.patch(`/checklists/${id}/approve`);
    return data;
  },

  reject: async (id: string, reason: string) => {
    const { data } = await axios.patch(`/checklists/${id}/reject`, { reason });
    return data;
  },

  getTemplates: async () => {
    const { data } = await axios.get('/checklists/templates');
    return data;
  },
};
