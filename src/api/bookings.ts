import api from './apiClient';

export interface Booking {
  id: number;
  eventId: number;
  userId: number;
  seats: number[];
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  name: string;
  email: string;
  mobile?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking | Booking[];
}

export interface CreateBookingData {
  eventId: number;
  seats: number[];
  quantity: number;
  totalAmount: number;
  name: string;
  email: string;
  mobile?: string;
}

export const bookingsApi = {
  create: async (bookingData: CreateBookingData) => {
    const response = await api.post<BookingResponse>('/bookings', bookingData);
    return response.data.data;
  },

  getAll: async (params?: { eventId?: number; userId?: number }) => {
    const response = await api.get<BookingResponse>('/bookings', { params });
    console.log("bookings Response",response);
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  getUserBookings: async (userId: number) => {
    const response = await api.get<BookingResponse>(`/bookings/user/${userId}`);
    console.log("user booking response",response);
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  getById: async (id: number | string) => {
    const response = await api.get<BookingResponse>(`/bookings/${id}`);
    return response.data.data;
  },

  update: async (id: number | string, status: string) => {
    const response = await api.put<BookingResponse>(`/bookings/${id}`, { status });
    return response.data.data;
  },
};
