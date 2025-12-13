// src/pages/Admin/AdminEvents.tsx
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/apiClient';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import type { Event } from '../../types/event';

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi().get('/events');
      const payload = res.data.data ?? res.data.events ?? res.data;
      setEvents(Array.isArray(payload) ? payload : []);
    } catch (e: any) {
      alert(e.message || 'Failed to load');
      setEvents([]);
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

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-30">
          <div className="px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-white truncate">Manage Events</h1>
            </div>
            <Link
              to="/admin/events/new"
              className="w-full sm:w-auto text-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition text-xs sm:text-sm font-medium shadow-lg whitespace-nowrap"
            >
              + Create Event
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Search Bar */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-4 mb-6">
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

            {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-400 text-lg">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-12 max-w-md text-center">
                  <svg 
                    className="mx-auto h-20 w-20 text-gray-600 mb-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-white mb-3">No Events Created</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm
                      ? 'No events match your search. Try different keywords.'
                      : 'Get started by creating your first event. Click the button below to begin!'}
                  </p>
                  <Link
                    to="/admin/events/new"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-medium shadow-lg"
                  >
                    Create First Event
                  </Link>
                </div>
              </div>
            ) : (
              filteredEvents.map(e => (
                <div 
                  key={e.id} 
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl hover:border-purple-500 transition-all"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="font-semibold text-xl text-white mb-2">{e.title}</div>
                    <div className="text-sm text-gray-400 mb-2">
                      📍 {e.location} • 📅 {new Date(e.date).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full">
                        💺 Available: {e.availableSeats} / {e.totalSeats}
                      </span>
                      <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full">
                        💰 ₹{e.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link 
                      to={`/admin/events/${e.id}/edit`} 
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-center"
                    >
                      ✏️ Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(e.id)} 
                      className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
