import eslintConfigPrettier from 'eslint-config-prettier';
import eslintImport from "eslint-plugin-import";
import typeScriptESLintParser from '@typescript-eslint/parser';
import typeScriptESLint from '@typescript-eslint/eslint-plugin';

export default [
  {
    plugins: {
      eslintImport,
    },
    rules: {
      "eslintImport/default": "error",
    },
  },
  {
    rules: {
      semi: ["error", "always"],
    },
  },
  {
    plugins: {
      typeScriptESLint,
    },
    files: ["**/bin/*.js", "**/bin/*.ts", "**/bin/*.jsx", "**/bin/*.tsx", "**/lib/*.js", "**/lib/*.ts", "**/lib/*.jsx", "**/lib/*.tsx"],
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },
      parser: typeScriptESLintParser,
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
  },
  eslintConfigPrettier,
];
