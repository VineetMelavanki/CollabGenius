/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter:    ["Inter", "sans-serif"],
        grotesk:  ["Space Grotesk", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        outfit:   ["Outfit", "sans-serif"],
        sora:     ["Sora", "sans-serif"],
        dm:       ["DM Sans", "sans-serif"],
        poppins:  ["Poppins", "sans-serif"],
        raleway:  ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [],
}
