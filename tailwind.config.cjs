// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        softGreen:  "#86A788",
        cream:      "#FFFDEC",
        lightPink:  "#FFE2E2",
        coral:      "#FFCFCF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
