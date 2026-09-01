/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nem: {
          black: '#111111',
          red: '#C5A059',
          darkred: '#A4813D',
          gold: '#C5A059',
          darkgold: '#A4813D',
          gray: '#666666',
          lightgray: '#F3EFE6',
          border: '#E5DECE',
          beige: '#FAF6F0',
        },
        lotus: {
          deep: '#C5A059',
          DEFAULT: '#C5A059',
          light: '#FAF6F0',
        },
        cream: '#FAF6F0',
        beige: '#FAF6F0',
        'deep-red': '#C5A059',
        rose: '#C5A059',
        'rose-light': '#F5EBE0',
        'brand-yellow': '#C5A059',
        'brand-orange': '#C5A059',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Lora', 'Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        script: ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}


