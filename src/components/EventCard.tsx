// src/components/EventCard.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Event } from '../types/event';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      className="bg-white rounded-lg shadow p-4 transition-shadow hover:shadow-lg"
    >
      <img 
        src={event.img || '/placeholder.jpg'} 
        alt={event.title} 
        className="w-full h-44 object-cover rounded" 
      />
      <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {event.location} • {new Date(event.date).toLocaleString()}
      </p>
      <div className="flex items-center justify-between mt-3">
        <div>
          <div className="text-sm text-gray-500">₹{Number(event.price).toFixed(2)}</div>
          <div className="text-xs text-gray-400">
            Available: {event.available_seats ?? '—'}
          </div>
        </div>
        <Link 
          to={`/events/${event.id}`} 
          className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
        >
          View
        </Link>
      </div>
    </motion.div>
  );
}
