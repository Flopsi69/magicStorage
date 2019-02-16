'use strict';

var gulp = require('gulp'),
postcss = require('gulp-postcss'),
sass = require('gulp-sass'),
sassGlob = require('gulp-sass-glob'),
sourcemaps = require('gulp-sourcemaps'),
autoprefixer = require('autoprefixer'),
plumber = require('gulp-plumber'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
mqpacker = require("css-mqpacker"),
uglify = require('gulp-uglify'),
fileInclude = require('gulp-file-include'),
fs = require('fs'),
gulpif = require('gulp-if'),
rimraf = require('rimraf'),
watch = require('gulp-watch'),
// cssmin = require('gulp-clean-css'),
browserSync = require("browser-sync"),
reload = browserSync.reload;

var path = {
  build: { 
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.html', 
    js: ['src/js/**/*.js', '!src/js/partials/*.js'],
    style: ['src/sass/style.scss'],
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/sass/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};


/*********TASK's*********/

//html
gulp.task('html:build', function() {
  gulp.src(path.src.html) 
  .pipe(fileInclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest(path.build.html)) 
  .pipe(reload({stream: true})); 
});


//sass
gulp.task('style:build', function() {

  var processors = [
  autoprefixer({ browsers: ['last 2 version', 'IE 10', 'IE 11'], cascade: false })
 /* mqpacker({
    sort: function(a, b) {
      a = a.replace(/\D/g, '');
      b = b.replace(/\D/g, '');
      return b - a;
    }
  })*/
  ];

  return gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));
});


//js
gulp.task('js:build', function () {
  return gulp.src(path.src.js)
  // .pipe(plumber())
  // .pipe(sourcemaps.init())
  // .pipe(uglify()) 
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.build.js)) 
  .pipe(reload({stream: true}));
});


//img
gulp.task('image:build', function() {
  return gulp.src(path.src.img) 
  .pipe(plumber())
  .pipe(gulpif(/[.](png|jpeg|jpg|svg)$/, imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{
      removeViewBox: false
    }],
    use: [pngquant()]
  })))
  .pipe(gulp.dest(path.build.img)) 
  .pipe(reload({stream: true}));
});


//fonts
gulp.task('fonts:build', function() {
 gulp.src(path.src.fonts)
 .pipe(plumber())
 .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', ['html:build', 'js:build', 'fonts:build', 'image:build', 'style:build']);



//livereload server
gulp.task('webserver', function () {
  browserSync(config);
});


//Clear build
gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});


// Watch
gulp.task('watch', function(){
  gulp.watch(path.watch.html, ['html:build']);
  gulp.watch(path.watch.style, ['style:build']);
  gulp.watch(path.watch.js, ['js:build']);
  gulp.watch(path.watch.img, ['image:build']);
  gulp.watch(path.watch.fonts, ['fonts:build']);
});


gulp.task('default', ['webserver', 'watch']);


