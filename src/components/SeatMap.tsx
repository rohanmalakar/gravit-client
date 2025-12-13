import { motion } from 'framer-motion';

interface SeatMapProps {
  totalSeats: number;
  bookedSeats: number[];
  lockedSeats: { [key: number]: string }; // seatNumber -> userId
  selectedSeats: number[];
  onSeatSelect: (seatNumber: number) => void;
  currentUserId: string;
  maxSelection?: number;
}

export default function SeatMap({
  totalSeats,
  bookedSeats,
  lockedSeats,
  selectedSeats,
  onSeatSelect,
  currentUserId,
  maxSelection = 10
}: SeatMapProps) {
  const SEATS_PER_ROW = 10;
  const rows = Math.ceil(totalSeats / SEATS_PER_ROW);

  const getSeatStatus = (seatNumber: number): 'available' | 'booked' | 'locked' | 'selected' => {
    if (selectedSeats.includes(seatNumber)) return 'selected';
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (lockedSeats[seatNumber] && lockedSeats[seatNumber] !== currentUserId) return 'locked';
    return 'available';
  };

  const getSeatColor = (status: string): string => {
    switch (status) {
      case 'selected': return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600';
      case 'booked': return 'bg-red-500 text-white cursor-not-allowed border-red-600';
      case 'locked': return 'bg-yellow-500 text-white cursor-not-allowed border-yellow-600';
      default: return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
    }
  };

  const handleSeatClick = (seatNumber: number) => {
    const status = getSeatStatus(seatNumber);
    
    if (status === 'booked') {
      alert(`Seat ${seatNumber} is already permanently booked by another customer.`);
      return;
    }
    
    if (status === 'locked') {
      alert(`Seat ${seatNumber} is temporarily held by another user.`);
      return;
    }

    if (status === 'available' && selectedSeats.length >= maxSelection) {
      alert(`You can only select up to ${maxSelection} seats`);
      return;
    }

    // Just select the seat, don't book it yet
    onSeatSelect(seatNumber);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base font-bold text-blue-900 dark:text-blue-100">
            How to Book Seats
          </p>
        </div>
        <ol className="text-left text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li><strong>1. Click seats</strong> to select them (they turn BLUE - not booked yet!)</li>
          <li><strong>2. Fill the form</strong> below with your details</li>
          <li><strong>3. Click "Confirm & Pay"</strong> button to permanently book the seats</li>
        </ol>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 font-semibold">
          ⚠️ Clicking a seat does NOT book it - only the Pay button books seats!
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span>Your Selection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
          <span>Locked by Others</span>
        </div>
      </div>

      {/* Screen */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 text-white text-center py-2 rounded-t-3xl mx-auto max-w-lg">
        <span className="text-sm font-semibold">SCREEN</span>
      </div>

      {/* Seat Grid */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <div className="inline-block min-w-full">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const rowSeats = [];
            for (let i = 0; i < SEATS_PER_ROW; i++) {
              const seatNumber = rowIndex * SEATS_PER_ROW + i + 1;
              if (seatNumber <= totalSeats) {
                rowSeats.push(seatNumber);
              }
            }

            return (
              <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                {rowSeats.map(seatNumber => {
                  const status = getSeatStatus(seatNumber);
                  const isDisabled = status === 'booked' || status === 'locked';

                  return (
                    <motion.button
                      key={seatNumber}
                      whileHover={!isDisabled ? { scale: 1.1 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      onClick={() => handleSeatClick(seatNumber)}
                      disabled={isDisabled}
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 
                        flex items-center justify-center 
                        rounded border-2 
                        font-semibold text-xs sm:text-sm
                        transition-all duration-200
                        ${getSeatColor(status)}
                      `}
                      title={`Seat ${seatNumber} - ${status}`}
                    >
                      {seatNumber}
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold text-green-900 dark:text-green-100">
              You Selected {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} ({selectedSeats.length}/{maxSelection}):
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <span
                key={seat}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
              >
                {seat}
              </span>
            ))}
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-2">
            💡 These seats are temporarily held for you. Complete the booking form below to confirm your purchase.
          </p>
        </div>
      )}
    </div>
  );
}
