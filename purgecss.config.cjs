module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.cjs'), // Reference the Tailwind CSS configuration file
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
