import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import video from "../../public/booking.mp4"

const ScrollVideoSection: React.FC = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: videoContainerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to scale (from 0.5 to 1.2)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  
  return (
    <div className="bg-black">
  
      {/* Video Section with Scroll Animation */}
      <div ref={videoContainerRef} className="min-h-[400px] md:min-h-[600px] lg:min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-12 relative">
        <div className="max-w-4xl w-full">
          <motion.div
            style={{ scale, opacity }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
          >
            {/* Video Container */}
            <div className="relative w-full aspect-video bg-linear-to-br from-purple-900 via-gray-900 to-black">
              
              {/* Uncomment and use this for actual video */}
              
              <video 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={video} type="video/mp4" />
              </video> 
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white"
                  >
                    <svg className="w-12 h-12 md:w-16 lg:w-20 md:h-16 lg:h-20 mx-auto mb-3 md:mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <p className="text-lg md:text-xl lg:text-2xl font-semibold">Video Preview</p>
                    <p className="text-sm md:text-base text-gray-400 mt-1 md:mt-2">Scroll to see animation</p>
                  </motion.div>
                </div>
              </div> */}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoSection;