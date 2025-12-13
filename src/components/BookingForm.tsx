// src/components/BookingForm.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import type { Event } from '../types/event';
import SeatMap from './SeatMap';
import useSocket from '../hooks/useSocket';

interface BookingFormProps {
  event: Event;
}

export default function BookingForm({ event }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const navigate = useNavigate();

  // Socket.io for real-time seat locking
  const { lockedSeats, lockSeat, unlockSeat, isConnected } = useSocket({
    eventId: event.id,
    userId: user?.id?.toString() || `guest-${Date.now()}`,
    onSeatLockFailed: (data) => {
      alert(`Seat ${data.seatIndex} is already locked: ${data.reason}`);
      // Remove from selected if lock failed
      setSelectedSeats(prev => prev.filter(s => s !== data.seatIndex));
    }
  });

  // Auto-fill user info if authenticated
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load booked seats
  useEffect(() => {
    loadBookedSeats();
  }, [event.id]);

  const loadBookedSeats = async () => {
    try {
      setLoadingSeats(true);
      const response = await api.get(`/seats/${event.id}/availability`);
      if (response.data.success) {
        setBookedSeats(response.data.data.bookedSeats || []);
      }
    } catch (error) {
      console.error('Error loading booked seats:', error);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatSelect = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      // Deselect and unlock
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
      unlockSeat(seatNumber);
    } else {
      // Select and lock
      setSelectedSeats(prev => [...prev, seatNumber]);
      lockSeat(seatNumber);
    }
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!name || !email || selectedSeats.length === 0) {
      alert('Please fill required fields and select at least one seat.');
      return;
    }

    setLoading(true);
    try {
      const bookingData = { 
        eventId: event.id, 
        name, 
        email, 
        mobile, 
        quantity: selectedSeats.length,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * Number(event.price)
      };

      const res = await api.post('/bookings', bookingData);
      const booking = res.data.data ?? res.data.booking ?? res.data;
      
      // Unlock all seats after successful booking
      selectedSeats.forEach(seat => unlockSeat(seat));
      
      setLoading(false);
      navigate('/booking-success', { state: { booking } });
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Booking failed. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="text-sm">Please log in to book tickets.</p>
        </div>
      )}

      {/* Seat Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Your Seats</h3>
        {loadingSeats ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading seats...</p>
          </div>
        ) : (
          <SeatMap
            totalSeats={event.totalSeats || 50}
            bookedSeats={bookedSeats}
            lockedSeats={lockedSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
            currentUserId={user?.id?.toString() || `guest-${Date.now()}`}
            maxSelection={10}
          />
        )}
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 px-3 py-2 rounded text-sm">
          ⚠️ Real-time updates unavailable. Reconnecting...
        </div>
      )}

      {/* Booking Details */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        
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
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || selectedSeats.length === 0 || !isAuthenticated}
        className="w-full bg-indigo-600 text-white rounded px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700 transition font-semibold"
      >
        {loading ? 'Booking…' : `Pay ₹${(selectedSeats.length * Number(event.price)).toFixed(2)} for ${selectedSeats.length} seat${selectedSeats.length !== 1 ? 's' : ''}`}
      </motion.button>

      {selectedSeats.length === 0 && (
        <div className="text-gray-600 text-sm text-center">
          Please select at least one seat to continue
        </div>
      )}
    </form>
  );
}
