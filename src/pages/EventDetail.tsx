// src/pages/EventDetail.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/apiClient';
import BookingForm from '../components/BookingForm';
import useSocket from '../hooks/useSocket';
import type { Event } from '../types/event';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/events/${id}`);
      const eventData = res.data.data ?? res.data.event ?? res.data;
      console.log('Event data received:', eventData);
      setEvent(eventData);
    } catch (e) {
      console.error('Load event error', e);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    load(); 
  }, [load]);

  // Socket.io connection for real-time updates (seat locking handled in BookingForm)
  useSocket();

  if (loading) {
    return (
      <div className="p-6 pt-24 text-center">
        <div className="text-gray-600">Loading event…</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 pt-24 text-center">
        <div className="text-red-600">Event not found</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <img 
            src={event.image || '/placeholder.jpg'} 
            alt={event.title} 
            className="w-full h-96 object-cover rounded-lg shadow" 
          />
          <h2 className="text-3xl font-semibold mt-4">{event.title}</h2>
          <p className="text-gray-600 mt-2">
            {event.location} • {new Date(event.date).toLocaleString()}
          </p>
          <p className="mt-4 whitespace-pre-line text-gray-700">{event.description}</p>
        </div>

        <aside className="bg-white rounded-lg p-6 shadow-lg h-fit">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-2xl font-medium">₹{Number(event.price || 0).toFixed(2)}</div>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            Available seats: <span className="font-semibold text-lg">{event.availableSeats}</span>
          </div>

          <BookingForm event={event} />
        </aside>
      </div>
    </main>
  );
}
