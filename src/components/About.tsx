import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedTicketButton from './BuyticketBtn';

const AnimatedDigit: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 150,
            damping: 25,
            mass: 0.8
          }}
          className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CountdownBox: React.FC<{ value: number; label: string; index: number }> = ({ value, label, index }) => {
  const digits = value.toString().padStart(2, '0').split('').map(Number);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col  items-center"
    >
      <div className="flex gap-1.5  sm:gap-2">
        <div className="bg-gray-900 rounded-xl  sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-6 w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-32 flex items-center justify-center border border-gray-800 shadow-2xl">
          <AnimatedDigit value={digits[0]} />
        </div>
        <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-6 w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 lg:w-24 lg:h-32 flex items-center justify-center border border-gray-800 shadow-2xl">
          <AnimatedDigit value={digits[1]} />
        </div>
      </div>
      <motion.p 
        className="text-gray-400 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

const SummitraCountdown: React.FC = () => {
  // Set target date to 2 days from when component first loads
  const [targetDate] = useState(() => new Date().getTime() + (2 * 24 * 60 * 60 * 1000));
  
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:p-12 lg:p-16">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            Next Big Event Starts In
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 sm:mb-10 md:mb-12 lg:mb-16"
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 leading-relaxed">
            Join thousands of attendees for an unforgettable experience.{' '}
            <span className="text-purple-400 font-semibold">Book your tickets now</span> and secure your spot{' '}
            <span className="text-gray-400">
              for exclusive events, workshops, and networking opportunities with real-time seat availability.
            </span>
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-end mb-8 sm:mb-10 md:mb-12">
          <CountdownBox value={timeLeft.days} label="Days" index={0} />
          <CountdownBox value={timeLeft.hours} label="Hours" index={1} />
          <CountdownBox value={timeLeft.minutes} label="Minutes" index={2} />
          <CountdownBox value={timeLeft.seconds} label="Seconds" index={3} />
        </div>

        <AnimatedTicketButton />
      </div>
    </div>
  );
};

export default SummitraCountdown;