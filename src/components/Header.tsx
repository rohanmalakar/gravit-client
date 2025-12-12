import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedTicketButton from './BuyticketBtn';

// --- 1. Custom Hook: useScrollDirection ---
// This hook determines the vertical scroll direction.
type ScrollDirection = 'up' | 'down' | 'initial';

const useScrollDirection = (): ScrollDirection => {
  const [scrollDir, setScrollDir] = useState<ScrollDirection>('initial');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDir = () => {
      const { scrollY } = window;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // Only update state if the direction has truly changed, 
      // and we are not at the very top of the page (scrollY > 10)
      if (direction !== scrollDir && Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDir(direction);
      }
      
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDir);
    return () => window.removeEventListener('scroll', updateScrollDir);
  }, [scrollDir]);

  return scrollDir;
};

// --- 2. The Smart Navbar Component ---
const SmartNavbar: React.FC = () => {
  const scrollDirection = useScrollDirection();
  
  // Determine if the navbar should be visible
  // It should be visible if we scroll 'up', or if we are at the very top (scrollDir === 'initial')
  const isVisible = scrollDirection === 'up' || scrollDirection === 'initial';
  
  // Framer Motion variants for smooth sliding
  const variants = {
    // Hidden state: pushed up and slightly faded
    hidden: { y: '-100%', opacity: 0, transition: { duration: 0.3 } },
    // Visible state: positioned normally
    visible: { y: '0%', opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      initial="visible"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
    >
      <div className="bg-[#8b5cf6] p-4 flex justify-between items-center h-20 shadow-xl">
        {/* Left Side: Logo/Brand */}
        <Link to="/" className="text-white text-3xl font-bold tracking-wider hover:text-white/90 transition">
          Summitra
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white/90 hover:text-white transition font-medium"
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className="text-white/90 hover:text-white transition font-medium"
          >
            Events
          </Link>
          <Link 
            to="/admin/events" 
            className="text-white/90 hover:text-white transition font-medium text-sm"
          >
            Admin
          </Link>
        </div>

        {/* Right Side: Contact and Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex flex-col text-right text-sm text-white/90">
            <span>(888) 123-4557</span>
            <span>info@example.com</span>
          </div>
          
          {/* Buy Ticket Button */}
          <AnimatedTicketButton />
        </div>
      </div>
    </motion.nav>
  );
};

// --- 3. Example Layout Component (for demonstration) ---
// This component provides enough content to make the scroll effect visible.
const LayoutWithNavbar: React.FC = () => {
    return (
        <>
            <SmartNavbar />
        </>
    );
};

export default LayoutWithNavbar;