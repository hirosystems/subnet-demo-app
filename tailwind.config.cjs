const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        aeonik: ["Aeonik"],
        sprat: ["Sprat", "Impact"],
      },
      boxShadow: {
        button: "4px 4px 0 0 #0D0C0C",
        "button-small": "2px 2px 0 0 #0D0C0C",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        hiro: {
          orange: "#FF5500",
          black: "#0D0C0C",
          white: "#F2F0ED",
          gray1: "#CFC9C2",
          gray2: "#8C877D",
          gray3: "#45403D",
          mint: "#C2EBC4",
          sky: "#B3D9FF",
          pink: "#FF9ECF",
          gold: "#BC812E",
          purple: "#AC9EFF",

          "neutral-0": "#F2F0ED",
          "neutral-100": "#E4E0DC",
          "neutral-200": "#CFC9C2",
          "neutral-300": "#8C877D",
          "neutral-400": "#595650",

          "gray-08": "rgba(228, 224, 220, 0.8)",
        },
      },
    },
  },
  plugins: [],
};
