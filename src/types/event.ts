// src/types/event.ts
export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  price: string | number;
  image?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  eventId: number;
  name: string;
  email: string;
  mobile?: string;
  quantity: number;
  totalAmount: number;
  createdAt?: string;
}

export interface SeatUpdatePayload {
  event_id: number;
  availableSeats: number;
}
