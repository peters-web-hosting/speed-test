/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#E3F2FD", // Light Blue
          DEFAULT: "#2196F3", // Primary Blue
          dark: "#0B79D0", // Dark Blue
        },
      },
    },
  },
  plugins: [],
};
