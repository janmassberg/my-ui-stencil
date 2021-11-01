module.exports = {
  root: true,
  env: {
    jest: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: ["eslint:recommended", "plugin:@stencil/recommended"],
  rules: {
    "@stencil/decorators-style": 0,
    "@stencil/decorators-context": 0,
    "@stencil/no-unused-watch": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^h$" },
    ],
    "no-extra-boolean-cast": 0,
    "no-unused-vars": 0,
    "react/jsx-no-bind": 0,
    "react/jsx-uses-vars": 2,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
