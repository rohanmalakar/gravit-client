/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom color tokens matching the Summitra theme
      colors: {
        primary: '#7c38b8',    // Main purple brand color
        primary2: '#a278d9',   // Lighter purple variant
        primary3: '#933be1',   // Mid-tone purple
        accent: '#fdda7a',     // Yellow accent color
        muted: '#ccc9c9',      // Gray for borders/muted elements
        deep: '#111111',       // Deep black for text
      },
      // Poppins font family
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      // Custom animations for smoother interactions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
