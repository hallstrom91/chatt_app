/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ffffff", // White
          dark: "#1c1e21", // Dark grey
        },
        secondary: {
          light: "#0084ff", // Messenger blue
          dark: "#0077e6", // Slightly darker blue
        },
        navbar: {
          light: "#f5f6f7", // Light grey
          dark: "#242526", // Very dark grey
        },
        chatLayout: {
          light: "#e4e6eb", // Light grey
          dark: "#3a3b3c", // Dark grey
        },
        chatHeader: {
          light: "#ffffff", // White
          dark: "#242526", // Very dark grey
        },
        chatUser: {
          light: "#d1e7ff", // Light blue
          dark: "#2e89ff", // Bright blue
        },
        chatGuest: {
          light: "#f1f0f0", // Very light
          dark: "#3e4042", // Dark grey
        },
        container: {
          light: "#e4e6e9", // light grey
          dark: "#2f3136", // Darker grey
        },
        btnLogin: {
          light: "#0084ff", // Blue // text white
          dark: "#005bb5", // Darker blue // text white
        },
        btnUpdate: {
          light: "#34c759", // Green // text white
          dark: "#30a14e", // Darker green // text white
        },
        btnDelete: {
          light: "#ff3b30", // Red // text white
          dark: "#c53030", // Darker red // text white
        },
        btnNeutral: {
          light: "#6c757d", // Neutral grey // text white
          dark: "#adb5bd", // Lighter grey // text black
        },
        btnPrimary: {
          light: "#007bff", // Bright blue // text white
          dark: "#0056b3", // Darker blue // text white
        },
        btnSecondary: {
          light: "#6c757d", // Grey // text white
          dark: "#495057", // Darker grey // text white
        },
        btnInfo: {
          light: "#17a2b8", // Teal // text white
          dark: "#138496", // Darker teal // text white
        },
        btnWarning: {
          light: "#ffc107", // Yellow // text black
          dark: "#e0a800", // Darker yellow // text black
        },
      },
    },
  },
  plugins: [],
};
