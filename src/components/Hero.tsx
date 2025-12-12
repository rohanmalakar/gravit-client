import React from 'react';
import AnimatedTicketButton from './BuyticketBtn';

// Define the hero component
const HeroSection: React.FC = () => {
  // Tailwind color variables for easy adjustment
  const primaryColor = 'bg-[#8b5cf6]'; // Vibrant Purple
  const textColor = 'text-white';
  const highlightColor = 'text-[#ffe066]'; // Yellow-White for headings

  // Background style with the required gradient/blob effect
  // Note: Creating complex SVG/CSS blob shapes is tricky in pure Tailwind. 
  // We'll use radial gradients and a slight overlay to mimic the depth and color variation.
  const backgroundStyle = {
    // Mimic the background gradient and subtle waves
    backgroundImage: `
      radial-gradient(at 0% 100%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(at 100% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundColor: primaryColor.replace('bg-', '#'), // Apply the base purple color
  };

  return (
    <section 
      style={backgroundStyle} 
      className={`min-h-screen flex items-center justify-center p-6 ${primaryColor} ${textColor}`}
    >
      {/* Content Container - Limits width on desktop */}
      <div className="max-w-4xl w-full text-center py-20 md:py-32">

        {/* --- Main Headline --- */}
        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight ${highlightColor} mb-8`}>
          Discover. Book.
          Experience. Unforgettable Events
        </h1>

        {/* --- Subtext --- */}
        <p className={`text-xl md:text-2xl font-semibold max-w-2xl mx-auto mb-16 px-4`}>
          Book tickets instantly for concerts, conferences, workshops, and exclusive events. Real-time booking with instant confirmation.
        </p>


        {/* --- CTA Section --- */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <AnimatedTicketButton />
          <div className="flex items-center gap-3">
            {/* Calendar Icon */}
            <div className="w-10 h-10 rounded-full bg-[#ffe066] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-medium">
              Events Happening Now
            </span>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
