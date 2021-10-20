module.exports = {
  arrowParens: "avoid",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: "consistent",
  printWidth: 180,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  overrides: [
    {
      files: "*.scss",
      options: {
        parser: "scss",
      },
    },
    {
      files: "*.ts",
      options: {
        parser: "typescript",
      },
    },
    {
      files: "*.mdx",
      options: {
        parser: "mdx",
      },
    },
  ],
};
