module.exports = {
  content: [
    './app/templates/**/*.html',
    './app/static/src/js/**/*.js',
  ],
  css: [
    './app/static/src/css/**/*.css',
  ],
  safelist: [
    'navbar',
    'footer',
    /^btn-/,
    'your-specific-class',
    'another-specific-class',
    // Add more classes based on diff results
  ],
}
