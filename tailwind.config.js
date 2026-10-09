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
        creme: '#FFF5ED',
        olive: '#8A855E',
        burgundy: '#BC4B78',
        gold: '#D7D98A',
        pink: '#F7CFDF',
        navy: '#341E04',
        anthracite: '#341E04',
        gris: '#8A855E',
        turquoise: '#19E7DB',
        beige: '#EDDBCE',
        cyan: '#D9FDFC',
        /* Alias */
        primary: '#19E7DB',
        secondary: '#8A855E',
        accent: '#BC4B78',
        framboise: '#BC4B78',
        'violet-profond': '#341E04',
        'violet-clair': '#8A855E',
        orange: '#D7D98A',
        or: '#D7D98A',
        dark: '#341E04',
        light: '#FFF5ED',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #19E7DB 0%, #8A855E 100%)',
        'warm-gradient': 'linear-gradient(135deg, #D7D98A 0%, #BC4B78 100%)',
        'soft-gradient': 'linear-gradient(135deg, #F7CFDF 0%, #D9FDFC 50%, #D7D98A 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(52, 30, 4, 0.35) 0%, rgba(188, 75, 120, 0.28) 50%, transparent 100%)',
      },
      fontFamily: {
        heading: ['Yeseva One', 'Georgia', 'serif'],
        subtitle: ['Monterchi', 'Georgia', 'serif'],
        body: ['Monterchi Serif', 'Georgia', 'serif'],
        serif: ['Monterchi Serif', 'Georgia', 'serif'],
        sans: ['Monterchi Serif', 'Georgia', 'serif'],
        photo: ['Sue Ellen Francisco', 'cursive'],
        site: ['Sue Ellen Francisco', 'cursive'],
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
