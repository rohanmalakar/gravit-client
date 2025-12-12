// src/components/BookingForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Event } from '../types/event';

interface BookingFormProps {
  event: Event;
}

export default function BookingForm({ event }: BookingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const maxAllowed = event.available_seats ?? 0;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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
      const res = await api.post('/bookings', { 
        event_id: event.id, 
        name, 
        email, 
        mobile, 
        quantity 
      });
      // expect res.data.booking
      const booking = res.data.booking ?? res.data;
      setLoading(false);
      navigate('/booking-success', { state: { booking } });
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Booking failed');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Name" 
        required 
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
      />
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
        type="email" 
        required 
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
      />
      <input 
        value={mobile} 
        onChange={e => setMobile(e.target.value)} 
        placeholder="Mobile" 
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
      />
      <div>
        <label className="block text-sm mb-1 font-medium">Quantity</label>
        <input 
          type="number" 
          min="1" 
          max={maxAllowed} 
          value={quantity} 
          onChange={e => setQuantity(Number(e.target.value))} 
          className="w-24 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        <div className="text-xs text-gray-500 mt-1">Available: {maxAllowed}</div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || maxAllowed === 0}
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
