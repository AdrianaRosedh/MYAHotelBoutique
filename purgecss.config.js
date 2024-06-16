module.exports = {
  content: [
    './app/templates/**/*.html',
  ],
  css: [
    './app/static/css/**/*.css',
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
