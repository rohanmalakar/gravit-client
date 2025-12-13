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
  const { lockedSeats, lockSeat, unlockSeat } = useSocket({
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
      console.log(`Seat ${seatNumber} deselected - NOT booked yet`);
    } else {
      // Select and lock (NOT booking yet)
      setSelectedSeats(prev => [...prev, seatNumber]);
      lockSeat(seatNumber);
      console.log(`Seat ${seatNumber} selected and temporarily locked - NOT booked yet`);
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
      console.error('Booking failed:', err);
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

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Total Amount:</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ₹{(selectedSeats.length * Number(event.price)).toFixed(2)}
          </span>
        </div>
        {selectedSeats.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ₹{Number(event.price).toFixed(2)}
          </p>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || selectedSeats.length === 0 || !isAuthenticated}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-4 py-4 disabled:opacity-60 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition font-bold text-lg shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Booking...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Confirm & Pay ₹{(selectedSeats.length * Number(event.price)).toFixed(2)}
          </span>
        )}
      </motion.button>

      {selectedSeats.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Please select at least one seat from the seat map above to continue
          </p>
        </div>
      )}
    </form>
  );
}
