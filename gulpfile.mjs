import gulp from 'gulp';
import { deleteAsync } from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import plumber from 'gulp-plumber';
import * as sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config.cjs';

const sass = gulpSass(sassCompiler);

const paths = {
  customStyles: {
    src: 
      'app/static/src/css/custom/**/*.{css,scss}'
    ,
    dest: 'app/static/dist/css/custom'
  },
  chatbotStyles: {
    src: 'app/static/src/css/chatbot/**/*.{css,scss}',
    dest: 'app/static/dist/css/chatbot'
  },
  vendorStyles: {
    src: 'app/static/src/css/vendor/**/*.css',
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
    ],
    custom: [
      'app/static/src/js/custom/particles.js',
      'app/static/src/js/custom/gsap.js',
      'app/static/src/js/custom/scripts.js',
      'app/static/src/js/custom/main.js',
      'app/static/src/js/custom/progress-bar-script.js',
    ],
    chatbot: [
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

function handleError(task) {
  return function(err) {
    console.error(`Error in ${task} task:`, err.message);
    console.error(`File: ${err.fileName}`);
    console.error(`Line: ${err.lineNumber}`);
    this.emit('end');
  };
}

function customStyles() {
  return gulp.src(paths.customStyles.src)
    .pipe(plumber({ errorHandler: handleError('customStyles') }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.customStyles.dest));
}

function chatbotStyles() {
  return gulp.src(paths.chatbotStyles.src)
    .pipe(plumber({ errorHandler: handleError('chatbotStyles') }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('chatbot-styles.css'))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.chatbotStyles.dest));
}

function vendorStyles() {
  return gulp.src(paths.vendorStyles.src)
    .pipe(plumber({ errorHandler: handleError('vendorStyles') }))
    .pipe(concat('vendor.css'))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.vendorStyles.dest));
}

function scripts() {
  const scriptPaths = [...paths.scripts.vendor, ...paths.scripts.custom];
  return gulp.src(scriptPaths, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('scripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function chatbotScripts() {
  return gulp.src(paths.scripts.chatbot, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('chatbotScripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('chatbot.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
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
    .pipe(gulp.dest(paths.fonts.dest));
}

const build = gulp.series(clean, gulp.parallel(customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, images, fonts));

function watchFiles() {
  gulp.watch(paths.customStyles.src, customStyles);
  gulp.watch(paths.chatbotStyles.src, chatbotStyles);
  gulp.watch(paths.vendorStyles.src, vendorStyles);
  gulp.watch([...paths.scripts.vendor, ...paths.scripts.custom], scripts);
  gulp.watch(paths.scripts.chatbot, chatbotScripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
}

gulp.task('build', build);
gulp.task('watch', gulp.parallel(watchFiles));

export { customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, images, fonts, clean, watchFiles as watch };
export default build;
