import api from './apiClient';

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: string;
  image: string;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: Event | Event[];
}

export const eventsApi = {
  getAll: async () => {
    const response = await api.get<EventResponse>('/events');
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  getById: async (id: number | string) => {
    const response = await api.get<EventResponse>(`/events/${id}`);
    return response.data.data;
  },

  create: async (eventData: Partial<Event>) => {
    const response = await api.post<EventResponse>('/events', eventData);
    return response.data.data;
  },

  update: async (id: number | string, eventData: Partial<Event>) => {
    const response = await api.put<EventResponse>(`/events/${id}`, eventData);
    return response.data.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete<EventResponse>(`/events/${id}`);
    return response.data;
  },
};
