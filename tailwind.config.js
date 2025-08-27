module.exports = {
  content: [
    "./views/**/*.{html,ejs}",
    "./views/*.{html}",
  ],
  // prefix: 'tw-',
  theme: {
    extend: {
      // fontSize:{
      //   responsive: "var(--text-responsive)",
      // },
    },
  },
  plugins: [require('daisyui')],
};