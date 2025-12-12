import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const AnimatedTicketButton: React.FC = () => {
  return (
      <motion.button
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden bg-white rounded-full pl-6 pr-2 py-2 shadow-2xl group"
      >
        <div className="flex items-center gap-3">
          {/* Text Container */}
          <div className="relative h-6 overflow-hidden flex items-center">
            <motion.span
              variants={{
                hover: { y: -30 }
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="block text-black text-lg font-bold whitespace-nowrap"
            >
              Buy Ticket
            </motion.span>
            <motion.span
              variants={{
                hover: { y: -30 }
              }}
              initial={{ y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-6 left-0 text-black text-lg font-bold whitespace-nowrap"
            >
              Buy Ticket
            </motion.span>
          </div>

          {/* Arrow Circle Container */}
          <div className="relative">
            <motion.div
              variants={{
                hover: { scale: 1.1 }
              }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center relative overflow-hidden"
            >
              {/* First Arrow */}
              <motion.div
                variants={{
                  hover: { x: 20, opacity: 0 }
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute"
              >
                <ChevronRight className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>

              {/* Second Arrow */}
              <motion.div
                variants={{
                  hover: { x: 0, opacity: 1 }
                }}
                initial={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute"
              >
                <ChevronRight className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.button>
  );
};

export default AnimatedTicketButton;