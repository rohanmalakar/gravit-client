// src/pages/EventsList.tsx
import { useEffect, useState, useCallback } from 'react';
import api from '../api/apiClient';
import EventCard from '../components/EventCard';
import useSocket from '../hooks/useSocket';
import type { Event } from '../types/event';

const CACHE_KEY = 'events_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  events: Event[];
  timestamp: number;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [usingCache, setUsingCache] = useState(false);

  // Get cached events from localStorage
  const getCachedEvents = (): Event[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { events, timestamp }: CachedData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (not expired)
      if (now - timestamp < CACHE_DURATION) {
        console.log('✅ Using cached events (age:', Math.round((now - timestamp) / 1000), 'seconds)');
        return events;
      } else {
        console.log('⏰ Cache expired, fetching fresh data');
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (e) {
      console.error('Error reading cache:', e);
      return null;
    }
  };

  // Save events to localStorage
  const setCachedEvents = (events: Event[]) => {
    try {
      const cacheData: CachedData = {
        events,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Events cached successfully');
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  };

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setUsingCache(false);
    
    try {
      // Try to get cached events first (if not forcing refresh)
      if (!forceRefresh) {
        const cachedEvents = getCachedEvents();
        if (cachedEvents) {
          setEvents(cachedEvents);
          setUsingCache(true);
          setLoading(false);
          return;
        }
      }

      // Fetch from API if no cache or force refresh
      console.log('🌐 Fetching events from API...');
      const res = await api.get('/events');
      const payload = res.data.data ?? res.data.events ?? res.data;
      const eventsList = Array.isArray(payload) ? payload : [];
      
      if (eventsList.length > 0) {
        console.log('Events loaded:', eventsList.length);
        console.log('Sample event dates:', eventsList.slice(0, 3).map(e => ({
          title: e.title,
          date: e.date,
          parsed: e.date ? new Date(e.date).toISOString().split('T')[0] : null
        })));
      }
      
      setEvents(eventsList);
      setCachedEvents(eventsList); // Save to cache
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

  // Socket.io connection for real-time updates (seat locking handled in BookingForm)
  useSocket();

  // Get unique locations from all events
  const uniqueLocations = Array.from(new Set(events.map(e => e.location).filter(Boolean)));

  // Filter events based on search and date
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Better date comparison - extract just the date part from event.date
    let matchesDate = true;
    if (dateFilter) {
      try {
        const eventDate = event.date ? new Date(event.date) : null;
        if (eventDate) {
          // Get date in YYYY-MM-DD format
          const eventDateStr = eventDate.toISOString().split('T')[0];
          matchesDate = eventDateStr === dateFilter;
        } else {
          matchesDate = false;
        }
      } catch (e) {
        console.error('Date parsing error:', e);
        matchesDate = false;
      }
    }
    
    // Location filter
    const matchesLocation = !locationFilter || event.location === locationFilter;
    
    return matchesSearch && matchesDate && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-purple-500 mb-4"></div>
            <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border border-purple-400 opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg font-medium">Loading amazing events...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Discover Events
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find and book tickets for the most exciting events happening near you
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 md:gap-6 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{events.length} Events Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>{uniqueLocations.length} Locations</span>
            </div>
            {usingCache && (
              <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-blue-400 font-medium">Cached</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 md:p-8 mb-10 shadow-2xl hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-xl font-bold text-white">Filter & Search</h2>
            </div>
            <button
              onClick={() => load(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium border border-gray-600 hover:border-transparent group"
              title="Refresh events from server"
            >
              <svg className="w-4 h-4 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Events
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Filter by Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600 cursor-pointer"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Filter by Location
              </label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-3.5 pr-10 bg-gray-900/80 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600 appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {(searchTerm || dateFilter || locationFilter) && (
            <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
                </div>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setLocationFilter('');
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 text-sm font-medium border border-gray-600 hover:border-gray-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Tags */}
        {(searchTerm || dateFilter || locationFilter) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-white">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {dateFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                Date: {new Date(dateFilter).toLocaleDateString()}
                <button onClick={() => setDateFilter('')} className="hover:text-white">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {locationFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter('')} className="hover:text-white">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 p-12 max-w-md text-center hover:border-purple-500/30 transition-all duration-300">
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
                {searchTerm || dateFilter || locationFilter
                  ? 'No events match your search criteria. Try adjusting your filters.'
                  : 'There are currently no events scheduled. Check back soon for upcoming events!'}
              </p>
              <button
                onClick={() => load(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Events
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((e, index) => (
                <div key={e.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-up">
                  <EventCard event={e} />
                </div>
              ))}
            </div>
            
            {/* Load More / Pagination Placeholder */}
            {filteredEvents.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                  Showing all {filteredEvents.length} events
                </p>
              </div>
            )}
          </>
        )}
    </main>
  );
}
