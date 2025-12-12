// src/types/event.ts
export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string;
  total_seats: number;
  available_seats: number;
  price: number;
  img?: string;
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
  available_seats: number;
}
