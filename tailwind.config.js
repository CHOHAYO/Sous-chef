/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': {
          50: '#fef8f6',
          100: '#fdf1ed',
          200: '#fce3db',
          300: '#fad5c9',
          400: '#f7b8a5',
          500: '#f39b81',
          600: '#e07d63',
          700: '#d66849',
          800: '#b84a31',
          900: '#9a3827',
        },
        'gold': {
          50: '#fffbf0',
          100: '#fff8e1',
          200: '#ffede6',
          300: '#ffe2cc',
          400: '#ffd099',
          500: '#ffbe66',
          600: '#ffb347',
          700: '#ff9500',
          800: '#cc7700',
          900: '#995500',
        },
        'charcoal': '#2a2a2a',
        'dior-gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d4d4d4',
          400: '#a8a8a8',
          500: '#7c7c7c',
          600: '#636363',
          700: '#4a4a4a',
          800: '#323232',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'garamond': ['Garamond', 'serif'],
        'serif': ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}
