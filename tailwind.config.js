const { nextui } = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs": '360px',
        "3xl": '1800px',
        "3xl": '1800px',
      },
      maxWidth:{
        "screen":"100vw"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}