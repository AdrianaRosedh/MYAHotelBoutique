import gulp from 'gulp';
import { deleteAsync } from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';

const paths = {
  customStyles: {
    src: 'app/static/src/css/custom/*.css',
    dest: 'app/static/dist/css/custom'
  },
  vendorStyles: {
    src: 'app/static/src/css/vendor/*.css',
    dest: 'app/static/dist/css/vendor'
  },
  scripts: {
    vendor: [
      'app/static/src/js/vendor/tailwindcss3.4.0.js',
      'app/static/src/js/vendor/jquery.min.js',
      'app/static/src/js/vendor/swiper-bundle.min.js',
      'app/static/src/js/vendor/bootstrap.bundle.min.js',
      'app/static/src/js/vendor/magnific-popup.min.js',
      'app/static/src/js/vendor/aos.js',
      'app/static/src/js/vendor/semantic.min.js',
      'app/static/src/js/vendor/slick.min.js',
      'app/static/src/js/vendor/particles.min.js',
      'app/static/src/js/vendor/app.js',
    ],
    custom: [
      'app/static/src/js/custom/gsap.js',
      'app/static/src/js/custom/scripts.js',
      'app/static/src/js/custom/main.js',
      'app/static/src/js/custom/progress-bar-script.js',
    ],
    chatbotAndFeatures: [
      'app/static/src/js/custom/chatbot.js',
      'app/static/src/js/custom/features/feature1.js',
      'app/static/src/js/custom/features/feature2.js'
    ],
    dest: 'app/static/dist/js'
  },
  images: {
    src: 'app/static/src/img/**/*.{jpg,jpeg,png,gif,svg}',
    dest: 'app/static/dist/img'
  },
  fonts: {
    src: 'app/static/src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    dest: 'app/static/dist/fonts'
  }
};

function clean() {
  return deleteAsync(['app/static/dist']);
}

function isNotMinified(file) {
  return !file.path.includes('.min.css');
}

function customStyles() {
  return gulp.src(paths.customStyles.src)
    .pipe(gulpIf(isNotMinified, postcss([
      autoprefixer(),
      cssnano(),
    ])))
    .on('error', (error) => {
      console.error('Error in customStyles task:', error.message);
    })
    .pipe(gulpIf(isNotMinified, rename({ suffix: '.min' })))
    .pipe(gulp.dest(paths.customStyles.dest))
    .on('end', () => {
      console.log('Finished customStyles task.');
    });
}

function vendorStyles() {
  return gulp.src(paths.vendorStyles.src)
    .pipe(gulpIf(isNotMinified, postcss([
      autoprefixer(),
      cssnano(),
    ])))
    .on('error', (error) => {
      console.error('Error in vendorStyles task:', error.message);
    })
    .pipe(gulpIf(isNotMinified, rename({ suffix: '.min' })))
    .pipe(gulp.dest(paths.vendorStyles.dest))
    .on('end', () => {
      console.log('Finished vendorStyles task.');
    });
}

function scripts() {
  const scriptPaths = [...paths.scripts.vendor, ...paths.scripts.custom];
  
  return gulp.src(scriptPaths, { sourcemaps: true, allowEmpty: true })
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .on('error', (error) => {
      console.error('Error in scripts task:', error.message);
    })
    .pipe(gulp.dest(paths.scripts.dest));
}

function chatbotAndFeaturesScripts() {
  return gulp.src(paths.scripts.chatbotAndFeatures, { sourcemaps: true, allowEmpty: true })
    .pipe(concat('chatbot-and-features.min.js'))
    .pipe(uglify())
    .on('error', (error) => {
      console.error('Error in chatbotAndFeaturesScripts task:', error.message);
    })
    .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(imagemin([
      imageminGifsicle({ interlaced: true }),
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest(paths.images.dest));
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .on('error', (error) => {
      console.error('Error in fonts task:', error.message);
    })
    .pipe(gulp.dest(paths.fonts.dest));
}

const build = gulp.series(clean, gulp.parallel(customStyles, vendorStyles, scripts, chatbotAndFeaturesScripts, images, fonts));

function watchFiles() {
  gulp.watch(paths.customStyles.src, customStyles);
  gulp.watch(paths.vendorStyles.src, vendorStyles);
  gulp.watch([...paths.scripts.vendor, ...paths.scripts.custom], scripts);
  gulp.watch(paths.scripts.chatbotAndFeatures, chatbotAndFeaturesScripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
}

gulp.task('build', build);
gulp.task('watch', gulp.parallel(watchFiles));

// Export tasks to Gulp CLI
export { customStyles, vendorStyles, scripts, chatbotAndFeaturesScripts, images, fonts, clean, watchFiles as watch };
export default build;
