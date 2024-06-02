/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light_tile: "#f0d8b6",
        dark_tile: "#b48764",
        bg_colour: "#202020",
      },
      spacing: {
        "tile-quarter": "25px",
      },
    },
  },
  plugins: [],
};
