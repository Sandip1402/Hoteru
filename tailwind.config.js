module.exports = {
  content: [
    "./views/**/*.{html,ejs}",
    "./views/*.{html}",
  ],
  theme: {
    extend: {
      // fontSize:{
      //   responsive: "var(--text-responsive)",
      // },
    },
  },
  plugins: [require('daisyui')],
};