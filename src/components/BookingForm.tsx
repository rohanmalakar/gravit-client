// src/components/BookingForm.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import type { Event } from '../types/event';

interface BookingFormProps {
  event: Event;
}

export default function BookingForm({ event }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const maxAllowed = event.availableSeats ?? 0;

  // Auto-fill user info if authenticated
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!name || !email || quantity < 1) {
      alert('Please fill required fields.');
      return;
    }
    if (quantity > maxAllowed) {
      alert('Quantity exceeds available seats.');
      return;
    }

    setLoading(true);
    try {
      const bookingData = { 
        eventId: event.id, 
        name, 
        email, 
        mobile, 
        quantity,
        totalAmount: quantity * Number(event.price)
      };

      const res = await api.post('/bookings', bookingData);
      const booking = res.data.data ?? res.data.booking ?? res.data;
      setLoading(false);
      navigate('/booking-success', { state: { booking } });
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Booking failed. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="text-sm">Please log in to book tickets.</p>
        </div>
      )}

      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Name" 
        required 
        disabled={loading}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100" 
      />
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
        type="email" 
        required 
        disabled={loading}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100" 
      />
      <input 
        value={mobile} 
        onChange={e => setMobile(e.target.value)} 
        placeholder="Mobile (Optional)" 
        disabled={loading}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100" 
      />
      <div>
        <label className="block text-sm mb-1 font-medium">Quantity</label>
        <input 
          type="number" 
          min="1" 
          max={maxAllowed} 
          value={quantity} 
          onChange={e => setQuantity(Number(e.target.value))} 
          disabled={loading}
          className="w-24 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100" 
        />
        <div className="text-xs text-gray-500 mt-1">Available: {maxAllowed}</div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || maxAllowed === 0 || !isAuthenticated}
        className="w-full bg-indigo-600 text-white rounded px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
      >
        {loading ? 'Booking…' : `Pay ₹${(quantity * Number(event.price)).toFixed(2)}`}
      </motion.button>

      {maxAllowed === 0 && (
        <div className="text-red-600 text-sm mt-2 font-medium">Sold out</div>
      )}
    </form>
  );
}
