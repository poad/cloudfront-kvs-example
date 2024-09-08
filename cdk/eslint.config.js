// @ts-check

// @ts-ignore
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import tseslint from 'typescript-eslint';
// @ts-ignore
import importPlugin from 'eslint-plugin-import';

import solid from 'eslint-plugin-solid';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      '**/*.d.ts',
      '*.{js,jsx}',
      'src/tsconfig.json',
      'src/stories',
      '**/*.css',
      'node_modules/**/*',
      'dist',
    ],
  },
  {
    files: ["**/{bin,lib}/*.(j|t)sx?"],
    ...importPlugin.flatConfigs.recommended,
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      solid,
    },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs'],
        '@typescript-eslint/parser': ['.ts'],
      },
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/ts/indent': ['error', 2],
      "comma-dangle": ["error", "always-multiline"],
      "quotes": ["error", "single"],
      'semi': ["error", "always"],
    }
  },
);
