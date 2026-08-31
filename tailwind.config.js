/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotus: {
          deep: '#EFB11D',
          DEFAULT: '#E43D12',
          light: '#FFF4D6',
        },
        cream: '#EBE9E1',
        'deep-red': '#D6536D',
        rose: '#D6536D',
        'rose-light': '#FFA2B6',
        'brand-yellow': '#EFB11D',
        'brand-orange': '#E43D12',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        script: ['Kaushan Script', 'cursive'],
      }
    },
  },
  plugins: [],
}
