/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react")

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          secondary: {
            DEFAULT: "#0369a1",
            foreground: "#D4D4D8",
          },
          grey: "#dddddd",
          focus: "#0369a1",
        },
      },
    },
  })],
}

