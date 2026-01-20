/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Enforce sorted imports and exports
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    // React 17+ does not require React variable in scope
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // Disable unused var rule for plain JS as well
    'no-unused-vars': 'off',
    // Set TypeScript unused vars to warning instead of error
    '@typescript-eslint/no-unused-vars': 'warn',
    // Disable an error for an empry code block
    'no-empty': 'off',
  },
};
