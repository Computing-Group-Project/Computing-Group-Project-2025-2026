/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        dark: {
          bg: '#1a1d23',        // Dark gray with subtle blue tint
          card: '#252930',      // Slightly lighter with blue tint for cards
          border: '#363c47',    // Gray-blue border
          text: '#FFFFFF',      // White text
          textMuted: '#9CA3AF', // Gray for muted text
          accent: '#EF4444',    // Red for dark mode
        },
        // Light Mode Colors
        light: {
          bg: '#FFFFFF',        // White background
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: '#111827',
          textMuted: '#6B7280', // Gray for subtitles
          accent: '#F87171',    // Red for light mode
          success: '#10B981',
        }
      }
    },
  },
  plugins: [],
}