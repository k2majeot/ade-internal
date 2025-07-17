const purgecss = require("@fullhuman/postcss-purgecss").default;
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    purgecss({
      content: ["./src/**/*.astro", "./src/**/*.js", "./public/**/*.html"],
      safelist: [
        /^modal/,
        /^fade/,
        /^show/,
        /^toast/,
        /^navbar/,
        /^collapse/,
        /^alert/,
        /^dropdown/,
        /^offcanvas/,
        /^tooltip/,
        /^popover/,
        /^carousel/,
        /^is-invalid/,
      ],
    }),
    autoprefixer(),
  ],
};
