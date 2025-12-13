import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedTicketButton from './BuyticketBtn';
import { useAuth } from '../contexts/AuthContext';

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
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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
      <div className="bg-[#8b5cf6] px-3 py-2 md:px-6 md:py-3 flex justify-between items-center h-14 md:h-16 shadow-xl">
        {/* Left Side: Logo/Brand */}
        <Link to="/" className="text-white text-lg md:text-xl lg:text-2xl font-bold tracking-wide hover:text-white/90 transition">
          Summitra
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
          <Link 
            to="/" 
            className="text-white/90 hover:text-white transition text-sm lg:text-base font-medium"
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className="text-white/90 hover:text-white transition text-sm lg:text-base font-medium"
          >
            Events
          </Link>
          {isAuthenticated && (
            <Link 
              to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="text-white/90 hover:text-white transition text-sm lg:text-base font-medium"
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link 
              to="/admin/events" 
              className="text-white/90 hover:text-white transition text-xs lg:text-sm font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side: User Menu or Login */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 md:space-x-2 text-white hover:text-white/90 transition"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block text-sm font-medium">{user?.name}</span>
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 md:w-48 bg-white rounded-lg shadow-xl py-1 md:py-2 z-50">
                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 md:px-4 py-2 text-sm text-gray-800 hover:bg-purple-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Manage Dashboard
                    </Link>
                  ):(
                    <Link
                      to="/dashboard"
                      className="block px-3 md:px-4 py-2 text-sm text-gray-800 hover:bg-purple-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Dashboard
                    </Link>
                  )
                }
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/events"
                      className="block px-3 md:px-4 py-2 text-sm text-gray-800 hover:bg-purple-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Manage Events
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-3 md:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-3">
              <Link
                to="/login"
                className="text-white hover:text-white/90 transition text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-2 md:px-3 py-1 md:py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Buy Ticket Button - Hidden on small screens */}
          <div className="hidden sm:block">
            <AnimatedTicketButton />
          </div>
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