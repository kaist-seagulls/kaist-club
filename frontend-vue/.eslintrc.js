module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "indent": [
      "error",
      2,
    ],
    "quotes": [
      "error",
      "double",
    ],
    "semi": [
      "error",
      "never",
    ],
    "comma-dangle": [
      "error",
      "always-multiline",
    ],
  },
}
