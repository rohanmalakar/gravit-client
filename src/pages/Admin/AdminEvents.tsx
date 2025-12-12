// src/pages/Admin/AdminEvents.tsx
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/apiClient';
import { Link } from 'react-router-dom';
import type { Event } from '../../types/event';

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi().get('/events');
      setEvents(res.data.events ?? res.data);
    } catch (e: any) {
      alert(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this event?')) return;
    try {
      await adminApi().delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  }

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin — Events</h1>
        <Link 
          to="/admin/events/new" 
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Event
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading…</div>
      ) : (
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-gray-600">No events found.</div>
          ) : (
            events.map(e => (
              <div 
                key={e.id} 
                className="flex items-center justify-between bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <div>
                  <div className="font-medium text-lg">{e.title}</div>
                  <div className="text-sm text-gray-500">
                    {e.location} • {new Date(e.date).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Available: {e.available_seats} / {e.total_seats}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/admin/events/${e.id}/edit`} 
                    className="px-3 py-1 border rounded hover:bg-gray-50 transition"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(e.id)} 
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
