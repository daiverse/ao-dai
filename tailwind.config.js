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
          deep: '#FFDF00',
          DEFAULT: '#C8920A',
          light: '#FDF3CC',
        },
        cream: '#FDF6C0',
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
