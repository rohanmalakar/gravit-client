// src/types/event.ts
export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  image?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  event_id: number;
  name: string;
  email: string;
  mobile?: string;
  quantity: number;
  total_amount: number;
  createdAt?: string;
}

export interface SeatUpdatePayload {
  event_id: number;
  availableSeats: number;
}
