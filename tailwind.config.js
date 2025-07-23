/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#008000",
          50: "#f0fff0",
          100: "#d9f9d9",
          200: "#b3f2b3",
          300: "#8ce68c",
          400: "#66d966",
          500: "#40cc40",
          600: "#33a333",
          700: "#267a26",
          800: "#195219",
          900: "#0d290d",
        },
      },
    },
  },
  plugins: [],
};
