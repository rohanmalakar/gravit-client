// src/pages/EventsList.tsx
import { useEffect, useState, useCallback } from 'react';
import api from '../api/apiClient';
import EventCard from '../components/EventCard';
import useSocket from '../hooks/useSocket';
import type { Event } from '../types/event';

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      // expect res.data.events or res.data
      const payload = res.data.events ?? res.data;
      setEvents(Array.isArray(payload) ? payload : []);
    } catch (e) {
      console.error('Events load error', e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  // socket updates
  useSocket(update => {
    setEvents(prev => 
      prev.map(ev => 
        ev.id === update.event_id 
          ? { ...ev, available_seats: update.available_seats } 
          : ev
      )
    );
  });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-600">Loading events…</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      {events.length === 0 ? (
        <div className="text-gray-600">No events found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </main>
  );
}
