// src/pages/BookingSuccess.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Booking } from '../types/event';

export default function BookingSuccess() {
  const { state } = useLocation();
  const booking = state?.booking as Booking | undefined;
  const navigate = useNavigate();

  if (!booking) {
    return (
      <div className="p-6 pt-24 text-center">
        <div>
          No booking info.{' '}
          <button 
            onClick={() => navigate('/events')} 
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Go to events
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
      >
        <div className="text-center mb-6">
          <div className="text-green-600 text-5xl mb-2">✓</div>
          <h2 className="text-3xl font-semibold">Booking Confirmed!</h2>
        </div>
        
        <p className="mt-4 text-gray-600">
          Booking ID: <span className="font-mono font-semibold">{booking.id}</span>
        </p>
        
        <div className="mt-6 space-y-3 border-t pt-4">
          <div className="flex justify-between">
            <strong>Name:</strong> 
            <span>{booking.name}</span>
          </div>
          <div className="flex justify-between">
            <strong>Email:</strong> 
            <span>{booking.email}</span>
          </div>
          
          {booking.seats && Array.isArray(booking.seats) && booking.seats.length > 0 && (
            <div className="flex flex-col gap-2">
              <strong>Seats:</strong>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat: number) => (
                  <span
                    key={seat}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
          {booking.mobile && (
            <div className="flex justify-between">
              <strong>Mobile:</strong> 
              <span>{booking.mobile}</span>
            </div>
          )}
          <div className="flex justify-between">
            <strong>Tickets:</strong> 
            <span>{booking.quantity}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-3 mt-3">
            <strong>Total:</strong> 
            <span>₹{Number(booking.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            Print / Save
          </button>
          <button 
            onClick={() => navigate('/events')} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Back to Events
          </button>
        </div>
      </motion.div>
    </main>
  );
}
