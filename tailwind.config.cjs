/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/templates/**/*.html', // Add your template paths
    './app/static/src/js/**/*.js', // Add your JavaScript paths
    './app/static/src/css/**/*.css', // Add your CSS paths
  ],
  safelist: [
    'navbar',
    'footer',
    // Remove the problematic pattern if it is not used
    // 'btn-', 
    'your-specific-class',
    'another-specific-class',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
