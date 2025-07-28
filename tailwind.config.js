

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#00D4FF",      // Electric blue
        secondary: "#00FF88",    // Neon green
        background: "#1a1a1a",   // Dark background
      },
    },
  },
  plugins: [],
}
