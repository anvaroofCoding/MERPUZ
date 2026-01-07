/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        stack: ["Stack Sans", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        libre: ["Libre Baskerville", "serif"],
        delius: ["Delius Unicase", "sans-serif"],
        bitter: ["Bitter", "serif"],
      },
    },
  },
  plugins: [],
};
