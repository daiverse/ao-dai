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
          deep: '#18392B',
          DEFAULT: '#C85A32',
          light: '#F4E8E1',
        },
        cream: '#FBF9F5',
        'deep-red': '#8B0000',
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
