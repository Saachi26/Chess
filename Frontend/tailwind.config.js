//** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light_tile: "#769656",
        dark_tile: "#EEEED2",
        bg_colour: "#202020",
        highlight: "#1A1A1A1A",
        check: "#FEEC48",
      },
      spacing: {
        "tile-quarter": "25px",
      },
    },
  },
  plugins: [],
};

