/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaint: {
          blue: "#0A2A66",
          light: "#E6ECF7",
          gray: "#F4F6FA",
        },
      },
    },
      keyframes: {
    lineGrow: {
      "0%": { transform: "scaleY(0)" },
      "100%": { transform: "scaleY(1)" },
    },
  },
  animation: {
    lineGrow: "lineGrow 1.5s ease-out forwards",
  },
  },
  plugins: [],
};
