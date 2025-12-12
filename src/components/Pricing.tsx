import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {  Plus } from 'lucide-react';
import AnimatedTicketButton from './BuyticketBtn';

const PricingSection: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  // Parallax effect: background moves slower (less distance)
  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  // Cards move faster (more distance)
  const cardsY = useTransform(scrollYProgress, [0, 1], [150, -50]);
  
  const blurBasic = useTransform(scrollYProgress, [0, 0.5, 1], [20, 5, 0]);
  const blurPremium = useTransform(scrollYProgress, [0, 0.5, 1], [20, 5, 0]);
  const opacityBasic = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);
  const opacityPremium = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.95, 1]);

  const basicFeatures = [
    'Full event access',
    'Access to keynote & breakout sessions',
    'Networking opportunities',
    'Access to post-event session recordings',
    'Conference materials and swag bag'
  ];

  const premiumFeatures = [
    'Full event access',
    'Access to keynote & breakout sessions',
    'Networking opportunities',
    'Access to post-event session recordings',
    'Conference materials and swag bag'
  ];

  return (
    <div className="min-h-screen overflow-hidden  border-2 rounded-[40px] bg-black">
      
      <div ref={ref} className="relative min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-purple-600 overflow-hidden">
        {/* Background decoration with slower parallax */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-700 rounded-full blur-3xl" />
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center pt-20 pb-16 px-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-6">
            Pricing For Tickets
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
            Explore our lineup of keynote speakers and industry <span className="text-white/60">leaders who</span>
            <br />
            <span className="text-white/60">will inspire and enlighten at the conference.</span>
          </p>
        </motion.div>

        {/* Pricing Cards with faster parallax */}
        <motion.div 
          style={{ y: cardsY }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 md:px-16 pb-32 mx-auto"
        >
          {/* Basic Card */}
          <motion.div
            style={{ 
              filter: useTransform(blurBasic, (val) => `blur(${val}px)`),
              opacity: opacityBasic,
              scale: scale
            }}
            className="relative bg-purple-700/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="mb-8">
              <span className="inline-block px-6 py-2 bg-purple-400/30 rounded-full text-white text-lg mb-6">
                Basic
              </span>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-7xl md:text-8xl font-bold text-yellow-300">$99</span>
              </div>
              <p className="text-white/70 text-lg mb-8">
                Explore our lineup of keynote speakers and industry <span className="text-white/50">leaders who will inspire and enlighten at the conference.</span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Plus className="w-6 h-6 text-yellow-300 shrink-0" />
                  <span className="text-white text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            <AnimatedTicketButton />
          </motion.div>

          {/* Premium Card */}
          <motion.div
            style={{ 
              filter: useTransform(blurPremium, (val) => `blur(${val}px)`),
              opacity: opacityPremium,
              scale: scale
            }}
            className="relative bg-purple-700/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          >
            <div className="mb-8">
              <span className="inline-block px-6 py-2 bg-purple-400/30 rounded-full text-white text-lg mb-6">
                Premium
              </span>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-7xl md:text-8xl font-bold text-yellow-300">$399</span>
              </div>
              <p className="text-white/70 text-lg mb-8">
                Explore our lineup of keynote speakers and industry <span className="text-white/50">leaders who will inspire and enlighten at the conference.</span>
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Plus className="w-6 h-6 text-yellow-300 shrink-0" />
                  <span className="text-white text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            <AnimatedTicketButton />
          </motion.div>
        </motion.div>
      </div>
    </div> 
  );
};

export default PricingSection;