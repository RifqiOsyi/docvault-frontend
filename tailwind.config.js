/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: '#0D0D0D',
        paper: '#F5F2EE',
        accent: '#E8611A',
        muted: '#8C8680',
        surface: '#EFECE8',
        border: '#D9D5D0',
      }
    },
  },
  plugins: [],
}
