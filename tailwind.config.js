/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#007BFF", // almost white
          dark: "#444444", // almost black
        },
        secondary: {
          light: "#6C757D", // grey-white
          dark: "#666666", // grey-black
        },
        font: {
          light: "#000000", // black
          dark: "#ffffff", // white
        },
        navbar: {
          light: "#c6c6c6", // almost white
          dark: "#202020", // dark grey
        },
        button: {
          light: "#3880b6", // light blue
          dark: "#65358b", // purple
        },
        lines: {
          light: "#2d5471", // shiny blue
          dark: "#a587bc", // light purple
        },
      },
    },
  },
  plugins: [],
};
