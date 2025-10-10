import axios from '../lib/axios';
import { Invoice } from '../types';

export interface InvoiceFilters {
  status?: string;
  bookingId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const invoiceService = {
  getAll: async (params?: InvoiceFilters) => {
    const { data } = await axios.get('/invoices', { params });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get(`/invoices/${id}`);
    return data;
  },

  create: async (invoice: Partial<Invoice>) => {
    const { data } = await axios.post('/invoices', invoice);
    return data;
  },

  update: async (id: string, invoice: Partial<Invoice>) => {
    const { data } = await axios.patch(`/invoices/${id}`, invoice);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`/invoices/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await axios.patch(`/invoices/${id}/status`, { status });
    return data;
  },

  markAsPaid: async (id: string) => {
    const { data } = await axios.patch(`/invoices/${id}/mark-paid`);
    return data;
  },
};
