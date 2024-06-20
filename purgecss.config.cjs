module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'), // Reference the Tailwind CSS configuration file
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
