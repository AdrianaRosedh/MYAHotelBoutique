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
import htmlmin from 'gulp-htmlmin';
import responsiveImages from 'gulp-responsive-images';
import browserSync from 'browser-sync';
import cache from 'gulp-cache';

const sass = gulpSass(sassCompiler);
const bs = browserSync.create();

const paths = {
  customStyles: {
    src: 'app/static/src/css/custom/**/*.{css,scss}',
    dest: 'app/static/dist/css/custom'
  },
  chatbotStyles: {
    src: 'app/static/src/css/custom/chatbot/**/*.{css,scss}',
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
  custom404: {
    src: 'app/static/src/js/custom/404.js',
    dest: 'app/static/dist/js'
  },
  sweetalert2: {
    src: 'app/static/src/js/custom/sweetalert2/DiVino.js',
    dest: 'app/static/dist/js'
  },
  images: {
    src: 'app/static/src/img/**/*.{jpg,jpeg,png,gif,svg,webp,JPG}',
    dest: 'app/static/dist/img'
  },
  fonts: {
    src: 'app/static/src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
    dest: 'app/static/dist/fonts'
  },
  html: {
    src: 'app/templates/**/*.html',
    dest: 'app/templates'
  }
};

function clean() {
  return deleteAsync(['app/static/dist']);
}

function handleError(task) {
  return function(err) {
    console.error(`Error in ${task} task:`, err.message);
    if (err.fileName) console.error(`File: ${err.fileName}`);
    if (err.lineNumber) console.error(`Line: ${err.lineNumber}`);
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
    .pipe(gulp.dest(paths.customStyles.dest))
    .pipe(bs.stream());
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
    .pipe(gulp.dest(paths.chatbotStyles.dest))
    .pipe(bs.stream());
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
    .pipe(gulp.dest(paths.vendorStyles.dest))
    .pipe(bs.stream());
}

function scripts() {
  const scriptPaths = [...paths.scripts.vendor, ...paths.scripts.custom];
  return gulp.src(scriptPaths, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('scripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

function chatbotScripts() {
  return gulp.src(paths.scripts.chatbot, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('chatbotScripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('chatbot.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

function custom404Script() {
  return gulp.src(paths.custom404.src, { sourcemaps: true })
    .pipe(plumber({ errorHandler: handleError('custom404Script') }))
    .pipe(sourcemaps.init())
    .pipe(concat('404.min.js'))
    .pipe(uglify().on('error', handleError('custom404Script')))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.custom404.dest))
    .pipe(bs.stream());
}

function sweetalert2Script() {
  return gulp.src(paths.sweetalert2.src, { sourcemaps: true })
    .pipe(plumber({ errorHandler: handleError('sweetalert2Script') }))
    .pipe(sourcemaps.init())
    .pipe(concat('sweetalert2.min.js'))
    .pipe(uglify().on('error', handleError('sweetalert2Script')))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.sweetalert2.dest))
    .pipe(bs.stream());
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(plumber({ errorHandler: handleError('images') }))
    .pipe(cache(imagemin([
      imageminGifsicle({ interlaced: true }),
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 })
    ], {
      verbose: true
    })).on('error', handleError('images')))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(bs.stream());
}

function responsiveImg() {
  return gulp.src(paths.images.src)
    .pipe(responsiveImages({
      '*.png': [
        { width: 320, suffix: '-320px' },
        { width: 640, suffix: '-640px' },
        { width: 1024, suffix: '-1024px' }
      ],
      '*.jpg': [
        { width: 320, suffix: '-320px' },
        { width: 640, suffix: '-640px' },
        { width: 1024, suffix: '-1024px' }
      ]
    }).on('error', handleError('responsiveImg')))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(bs.stream());
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(bs.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(plumber({ errorHandler: handleError('html') }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      ignoreCustomFragments: [/\{\%[\s\S]*?\%\}/, /\{\{[\s\S]*?\}\}/]
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());
}

function favicon() {
  return gulp.src('app/static/src/img/favicons/**/*.{ico,png}')
    .pipe(gulp.dest('app/static/dist/img/favicons'))
    .pipe(bs.stream());
}

function serve() {
  bs.init({
    server: {
      baseDir: './app'
    }
  });

  gulp.watch(paths.customStyles.src, customStyles);
  gulp.watch(paths.chatbotStyles.src, chatbotStyles);
  gulp.watch(paths.vendorStyles.src, vendorStyles);
  gulp.watch([...paths.scripts.vendor, ...paths.scripts.custom], scripts);
  gulp.watch(paths.scripts.chatbot, chatbotScripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.custom404.src, custom404Script);
  gulp.watch(paths.sweetalert2.src, sweetalert2Script);
}

const build = gulp.series(clean, gulp.parallel(customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, images, responsiveImg, fonts, html, favicon, custom404Script, sweetalert2Script));

function watchFiles() {
  gulp.watch(paths.customStyles.src, customStyles);
  gulp.watch(paths.chatbotStyles.src, chatbotStyles);
  gulp.watch(paths.vendorStyles.src, vendorStyles);
  gulp.watch([...paths.scripts.vendor, ...paths.scripts.custom], scripts);
  gulp.watch(paths.scripts.chatbot, chatbotScripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.custom404.src, custom404Script);
  gulp.watch(paths.sweetalert2.src, sweetalert2Script);
}

gulp.task('build', build);
gulp.task('watch', gulp.parallel(watchFiles, serve));

export { customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, images, responsiveImg, fonts, clean, html, favicon, custom404Script, sweetalert2Script, watchFiles as watch };
export default build;
