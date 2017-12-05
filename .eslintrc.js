module.exports = {
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "space-before-function-paren": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  },
  env: {
    es6: true
  },
  //'extends': 'eslint:recommended',
  extends: "standard",
  parser: "babel-eslint"
};
