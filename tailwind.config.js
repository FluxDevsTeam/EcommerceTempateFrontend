/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        'customBlue': '#0078A5',
      },
      scrollSnapType: {
        'x': 'x',
        'mandatory': 'mandatory',
      },
      scrollSnapAlign: {
        'start': 'start',
      },
      screens: {
        'xxs': '320px',
        'xs': '375px',
      },
    },
  },
  plugins: [],
};