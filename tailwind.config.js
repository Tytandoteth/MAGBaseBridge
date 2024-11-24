/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bai Jamjuree', 'sans-serif'],
      },
      colors: {
        primary: '#2DFFF9',
        secondary: '#DAEFFF',
        error: '#FF7777',
        background: {
          dark: '#1A1A1A',
          card: '#FFFFFF',
          input: '#F5F5F5',
        },
        text: {
          primary: '#000000',
          secondary: '#4A4A4A',
          light: '#DAEFFF',
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}