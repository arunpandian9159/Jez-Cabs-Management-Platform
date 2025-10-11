import axios from '../lib/axios';
import { Checklist } from '../types';

export const checklistService = {
  getAll: async () => {
    const { data } = await axios.get('/checklists');
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
};
