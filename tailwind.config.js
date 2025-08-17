module.exports = {
  content: [
    "./views/**/*.{html,ejs}",
    "./views/*.{html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};