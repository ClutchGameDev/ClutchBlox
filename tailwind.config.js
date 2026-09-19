/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff5f3",
          100: "#ffe8e4",
          200: "#ffd5ce",
          300: "#ffb2a3",
          400: "#ff7e6b",
          500: "#ff4b33",
          DEFAULT: "#ff4b33",
          600: "#e63822",
          700: "#c42a17",
          800: "#9e2010",
          900: "#7f1a0d",
        },
        surface: {
          950: "#120e0d",
          900: "#1c1615",
          850: "#241d1b",
          800: "#2d2422",
          700: "#403330",
          600: "#5a4945",
        }
      },
      fontFamily: {
        heading: ["Rubik", "system-ui", "-apple-system", "sans-serif"],
        body: ["Lexend", "system-ui", "-apple-system", "sans-serif"],
        sans: ["Lexend", "system-ui", "-apple-system", "sans-serif"],
      }
    },
  },
  plugins: [],
}
