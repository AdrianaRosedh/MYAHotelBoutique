module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    globals: {
      anime: 'readonly',
      Swal: 'readonly',
      AOS: 'readonly',
      jQuery: 'readonly',
      particlesJS: 'readonly',
    },
  };
  