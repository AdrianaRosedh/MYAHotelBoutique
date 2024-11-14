// eslint.config.js
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: ["node_modules/**"],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        anime: "readonly",
        Swal: "readonly",
        AOS: "readonly",
        jQuery: "readonly",
        particlesJS: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "no-undef": "off",
    },
  },
];
