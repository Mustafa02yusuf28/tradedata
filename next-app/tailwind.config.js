/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neon: {
          cyan: '#00ffcc',
          blue: '#0080ff',
          purple: '#8b5cf6',
          pink: '#ff0080',
        },
        dark: {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0a0a0a',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      backdropBlur: {
        'xs': '2px',
        '4xl': '80px',
      },
      animation: {
        'float': 'float 20s infinite linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        },
        glow: {
          '0%': { textShadow: '0 0 20px rgba(0, 255, 204, 0.5)' },
          '100%': { textShadow: '0 0 30px rgba(0, 255, 204, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '0.7', transform: 'scaleY(1)' },
          '50%': { opacity: '1', transform: 'scaleY(1.2)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 