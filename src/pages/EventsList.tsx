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
      // API returns: { success: true, message: "...", data: [...] }
      const payload = res.data.data ?? res.data.events ?? res.data;
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
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-20 pt-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-center">Upcoming Events</h1>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-12 max-w-md text-center">
              <svg 
                className="mx-auto h-24 w-24 text-gray-600 mb-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-3">No Events Available</h3>
              <p className="text-gray-400 mb-6">
                There are currently no events scheduled. Check back soon for upcoming events!
              </p>
              <button
                onClick={load}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-medium shadow-lg"
              >
                Refresh Events
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </main>
  );
}
