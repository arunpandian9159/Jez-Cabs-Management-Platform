import axios from '../lib/axios';
import { Booking } from '../types';

export interface BookingFilters {
  status?: string;
  cabId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const bookingService = {
  getAll: async (params?: BookingFilters) => {
    const { data } = await axios.get('/bookings', { params });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get(`/bookings/${id}`);
    return data;
  },

  create: async (booking: Partial<Booking>) => {
    const { data } = await axios.post('/bookings', booking);
    return data;
  },

  update: async (id: string, booking: Partial<Booking>) => {
    const { data } = await axios.patch(`/bookings/${id}`, booking);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`/bookings/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await axios.patch(`/bookings/${id}/status`, { status });
    return data;
  },

  assignDriver: async (id: string, driverId: string) => {
    const { data } = await axios.patch(`/bookings/${id}/assign-driver`, { driverId });
    return data;
  },
};
