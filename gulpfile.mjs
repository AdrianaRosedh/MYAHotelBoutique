import gulp from 'gulp';
import { deleteAsync } from 'del';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber';
import * as sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config.cjs';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminWebp from 'imagemin-webp';
import through2 from 'through2';
import imageResize from 'gulp-image-resize';
import browserSync from 'browser-sync';
import cache from 'gulp-cache';
import path from 'path';
import filter from 'gulp-filter';
import purgecss from '@fullhuman/postcss-purgecss';

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
      'app/static/src/js/custom/main.js',
      'app/static/src/js/custom/progress-bar-script.js',
    ],
    chatbot: [
      'app/static/src/js/custom/chatbot.js'
    ],
    dest: 'app/static/dist/js'
  },
  images: {
    src: 'app/static/src/img/**/*.{jpg,jpeg,png,gif,svg,webp,JPG,JPEG,PNG,GIF,SVG,WEBP}',
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
  return function (err) {
    console.error(`Error in ${task} task:`, err.message);
    if (err.fileName) console.error(`File: ${err.fileName}`);
    if (err.lineNumber) console.error(`Line: ${err.lineNumber}`);
    this.emit('end');
  };
}

function customStyles() {
  console.log('Running customStyles task');
  return gulp.src(paths.customStyles.src)
    .pipe(plumber({ errorHandler: handleError('customStyles') }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      autoprefixer(),
      cssnano(),
      purgecss({
        content: [
          './app/templates/**/*.html',
          './app/static/src/js/**/*.js'
        ],
        safelist: {
          standard: [/^navbar/, /^footer/, 'your-specific-class', 'another-specific-class'],
          deep: [/data-theme$/]
        },
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      })
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.customStyles.dest))
    .pipe(bs.stream());
}

function chatbotStyles() {
  console.log('Running chatbotStyles task');
  return gulp.src(paths.chatbotStyles.src)
    .pipe(plumber({ errorHandler: handleError('chatbotStyles') }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('chatbot-styles.css'))
    .pipe(postcss([
      tailwindcss(tailwindConfig),
      autoprefixer(),
      cssnano(),
      purgecss({
        content: [
          './app/templates/**/*.html',
          './app/static/src/js/**/*.js'
        ],
        safelist: {
          standard: [/^navbar/, /^footer/, 'your-specific-class', 'another-specific-class'],
          deep: [/data-theme$/]
        },
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      })
    ]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.chatbotStyles.dest))
    .pipe(bs.stream());
}

function vendorStyles() {
  console.log('Running vendorStyles task');
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
  console.log('Running scripts task');
  const scriptPaths = [...paths.scripts.vendor, ...paths.scripts.custom];
  return gulp.src(scriptPaths, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('scripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

function chatbotScripts() {
  console.log('Running chatbotScripts task');
  return gulp.src(paths.scripts.chatbot, { sourcemaps: true, allowEmpty: true })
    .pipe(plumber({ errorHandler: handleError('chatbotScripts') }))
    .pipe(sourcemaps.init())
    .pipe(concat('chatbot.min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

function processImages() {
  console.log('Running processImages task');
  const imgFilter = filter(['**/*.{jpg,jpeg,png,JPG,JPEG,PNG}', '!**/*.{gif,svg,webp,GIF,SVG,WEBP}'], { restore: true });

  return gulp.src(paths.images.src)
    .pipe(plumber({ errorHandler: handleError('processImages') }))
    .pipe(cache(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminOptipng({ optimizationLevel: 5 }),
      imageminWebp({ quality: 100 })
    ], {
      verbose: true
    })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(imgFilter)
    .pipe(
      through2.obj(function (file, _, cb) {
        const ext = path.extname(file.path);
        const basename = path.basename(file.path, ext);
        const dir = path.dirname(file.path);

        if (dir.includes('hero')) {
          const sizes = [
            { width: 600, suffix: '-600' },
            { width: 900, suffix: '-900' }
          ];

          const originalWebpPromise = new Promise((resolve, reject) => {
            gulp.src(file.path)
              .pipe(imagemin([imageminWebp({ quality: 100 })]))
              .pipe(rename({ suffix: '-original', extname: '.webp' }))
              .pipe(gulp.dest(dir))
              .on('end', resolve)
              .on('error', reject);
          });

          const resizePromises = sizes.map(size => {
            return new Promise((resolve, reject) => {
              gulp.src(file.path)
                .pipe(imageResize({ width: size.width }))
                .pipe(rename({ suffix: size.suffix }))
                .pipe(gulp.dest(dir))
                .on('end', resolve)
                .on('error', reject);
            });
          });

          const webpPromises = sizes.map(size => {
            return new Promise((resolve, reject) => {
              gulp.src(file.path)
                .pipe(imageResize({ width: size.width }))
                .pipe(imagemin([imageminWebp({ quality: 100 })]))
                .pipe(rename({ suffix: size.suffix, extname: '.webp' }))
                .pipe(gulp.dest(dir))
                .on('end', resolve)
                .on('error', reject);
            });
          });

          Promise.all([originalWebpPromise, ...resizePromises, ...webpPromises])
            .then(() => cb(null, file))
            .catch(err => cb(err));
        } else {
          const sizes = [300, 600, 900];
          const originalPromises = sizes.map(size => {
            return new Promise((resolve, reject) => {
              gulp.src(file.path)
                .pipe(imageResize({ width: size }))
                .pipe(rename({ suffix: `-${size}` }))
                .pipe(gulp.dest(dir))
                .on('end', resolve)
                .on('error', reject);
            });
          });

          const webpPromises = sizes.map(size => {
            return new Promise((resolve, reject) => {
              gulp.src(file.path)
                .pipe(imageResize({ width: size }))
                .pipe(imagemin([imageminWebp({ quality: 100 })]))
                .pipe(rename({ suffix: `-${size}`, extname: '.webp' }))
                .pipe(gulp.dest(dir))
                .on('end', resolve)
                .on('error', reject);
            });
          });

          Promise.all([...originalPromises, ...webpPromises])
            .then(() => cb(null, file))
            .catch(err => cb(err));
        }
      })
    )
    .pipe(imgFilter.restore);
}

function fonts() {
  console.log('Running fonts task');
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(bs.stream());
}

function html() {
  console.log('Running html task');
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
  console.log('Running favicon task');
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
  gulp.watch(paths.images.src, gulp.series(processImages));
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
  
}

const build = gulp.series(clean, gulp.parallel(customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, processImages, fonts, html, favicon));

function watchFiles() {
  gulp.watch(paths.customStyles.src, customStyles);
  gulp.watch(paths.chatbotStyles.src, chatbotStyles);
  gulp.watch(paths.vendorStyles.src, vendorStyles);
  gulp.watch([...paths.scripts.vendor, ...paths.scripts.custom], scripts);
  gulp.watch(paths.scripts.chatbot, chatbotScripts);
  gulp.watch(paths.images.src, gulp.series(processImages));
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
}

gulp.task('build', build);
gulp.task('watch', gulp.parallel(watchFiles, serve));

export { customStyles, chatbotStyles, vendorStyles, scripts, chatbotScripts, processImages, fonts, clean, html, favicon, watchFiles as watch };
export default build;