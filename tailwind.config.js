/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF8C42", // Orange
        secondary: "#4A9B8E", // Teal
        accent: "#1F3A5F", // Dark Navy
        success: "#4A9B8E",
        warning: "#FF8C42",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
