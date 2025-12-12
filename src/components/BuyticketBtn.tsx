import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const AnimatedTicketButton: React.FC = () => {
  return (
      <motion.button
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-lg group w-fit"
      >
        <div className="flex items-center gap-2">
          {/* Text Container */}
          <div className="relative h-5 overflow-hidden flex items-center">
            <motion.span
              variants={{
                hover: { y: -24 }
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="block text-black text-sm font-semibold whitespace-nowrap"
            >
              Buy Ticket
            </motion.span>
            <motion.span
              variants={{
                hover: { y: -24 }
              }}
              initial={{ y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-5 left-0 text-black text-sm font-semibold whitespace-nowrap"
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
              className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center relative overflow-hidden"
            >
              {/* First Arrow */}
              <motion.div
                variants={{
                  hover: { x: 20, opacity: 0 }
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute"
              >
                <ChevronRight className="w-4 h-4 text-white" strokeWidth={3} />
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
                <ChevronRight className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.button>
  );
};

export default AnimatedTicketButton;