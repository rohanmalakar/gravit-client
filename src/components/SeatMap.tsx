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
    
    if (status === 'booked' || status === 'locked') {
      return;
    }

    if (status === 'available' && selectedSeats.length >= maxSelection) {
      alert(`You can only select up to ${maxSelection} seats`);
      return;
    }

    onSeatSelect(seatNumber);
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded"></div>
          <span>Locked</span>
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Selected Seats ({selectedSeats.length}/{maxSelection}):
          </p>
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
        </div>
      )}
    </div>
  );
}
