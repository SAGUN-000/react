/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'bounce-light': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
        'pulse-light': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.7',
          },
        },
        'glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-in-out',
        'fade-out': 'fade-out 0.6s ease-in-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'bounce-light': 'bounce-light 2s ease-in-out infinite',
        'pulse-light': 'pulse-light 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
