/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Palette officielle Collection Aur'art */
        creme: '#F9F6F0',
        olive: '#6C8157',
        burgundy: '#7C2A3C',
        gold: '#C7A11E',
        pink: '#F1B2C8',
        navy: '#212E50',
        anthracite: '#212E50',
        gris: '#5A5A5A',
        /* Alias */
        primary: '#7C2A3C',
        secondary: '#6C8157',
        accent: '#C7A11E',
        framboise: '#7C2A3C',
        'violet-profond': '#212E50',
        'violet-clair': '#6C8157',
        orange: '#C7A11E',
        or: '#C7A11E',
        dark: '#212E50',
        light: '#F9F6F0',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7C2A3C 0%, #212E50 100%)',
        'warm-gradient': 'linear-gradient(135deg, #C7A11E 0%, #7C2A3C 100%)',
        'soft-gradient': 'linear-gradient(135deg, #F1B2C8 0%, #6C8157 50%, #C7A11E 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(33, 46, 80, 0.5) 0%, rgba(124, 42, 60, 0.35) 50%, transparent 100%)',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
