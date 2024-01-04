module.exports = {
  ignorePatterns: ['**/*.d.ts', '**/*.js', 'app/src/**/*.tsx'],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    useJSXTextNode: true,
    project: true,
    projectRoot: __dirname,
    tsconfigRootDir: __dirname,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/indent': ['off'],
    '@typescript-eslint/semi': ['off'],
    '@typescript-eslint/comma-dangle': ['off'],
    '@typescript-eslint/member-delimiter-style': ['off'],
    '@typescript-eslint/space-before-function-paren': ['off'],
  },
};
