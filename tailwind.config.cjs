/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/templates/**/*.html',
    './app/static/src/js/**/*.js',
    './app/static/src/css/**/*.css',
  ],
  safelist: [
    'navbar',
    'footer',
    'btn-primary',
    'bg-blue-500',
    'text-center',
    'hidden',
    'md:block',
    // Add more classes based on what you find missing in the output
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
