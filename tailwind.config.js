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
        framboise: '#D63384',
        violet: {
          profond: '#6A2C70',
          clair: '#9B59B6',
        },
        orange: '#E67E22',
        creme: '#FAF8F3',
        anthracite: '#2C2C2C',
        gris: '#5A5A5A',
        or: '#C9A961',
        // Alias
        primary: '#D63384',
        secondary: '#6A2C70',
        accent: '#E67E22',
        dark: '#2C2C2C',
        light: '#FAF8F3',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #D63384 0%, #6A2C70 100%)',
        'soft-gradient': 'linear-gradient(135deg, #9B59B6 0%, #D63384 50%, #E67E22 100%)',
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}