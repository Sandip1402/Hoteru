/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./views/**/*.{ejs,html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
