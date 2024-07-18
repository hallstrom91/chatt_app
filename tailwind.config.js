/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ffffff", // white
          dark: "#000000", // black or #071011
        },
        secondary: {
          light: "#8592a2", //
          dark: "#495059", //
        },
        navbar: {
          light: "#c6c6c6", // almost white
          dark: "#071011", // dark blue
        },
        chatLayout: {
          light: "#b3b3b3",
          dark: "#535353",
        },
        chatHeader: {
          light: "#707070",
          dark: "#1a3e46",
        },
        chatUser: {
          light: "#405588",
          dark: "#405588",
        },
        chatGuest: {
          light: "#b1b7c2",
          dark: "#b1b7c2",
        },
      },
    },
  },
  plugins: [],
};
