var gulp = require('gulp');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-size');
var csslint = require('gulp-csslint');
var assets = require("gulp-assets");
var benchmark = require('gulp-bench');
var concat = require('gulp-concat-sourcemap');


// JS hint task
gulp.task('jshint', function() {
  gulp.src(['./dev/public/js/*.js','./dev/public/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './dev/public/images/**/*',
      imgDst = './production/public/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './dev/public/*.html',
      htmlDst = './production/public';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./dev/public/js/*.js','./dev/public/js/**/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./production/public/js/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./dev/public/css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./production/public/css/'));
});

// Project Size Output
gulp.task('size', function () {
    return gulp.src('./dev/*')
        .pipe(size())
        .pipe(gulp.dest('./production/data'));
});

// CSS Linter
gulp.task('csslint', function() {
  gulp.src('./dev/public/css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});

// Pull JS and CSS From HTML for use as Objects
gulp.task('assets', function() {
gulp.src("./dev/public/*.html")
    .pipe(assets({
        js: true,
        css: true
    }))
    .pipe(gulp.dest("./production/public/"));
});

// Benchmark Test
gulp.task('bench', function () {
    return gulp.src('./dev/test.js', {read: false})
        .pipe(benchmark())
        .pipe(gulp.dest('.'));
});

// Concat All Files Into Sourcemap Output
gulp.task('concatmap', function() {
    gulp.src('*')
        .pipe(concat('sourcemap.js'))
        .pipe(gulp.dest('./dev/sourcemap'));
});




// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles', 'csslint', 'assets', 'concatmap'], function() {
  // watch for HTML changes
  gulp.watch('./dev/public/*.html', function() {
    gulp.run('htmlpage');
  });

  // watch for HTML Asset changes
  gulp.watch('./dev/public/*.html', function() {
    gulp.run('assets');
  });

  // watch for JS changes
  gulp.watch(['./dev/public/js/*.js','./dev/public/js/**/*.js'], function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for CSS changes
  gulp.watch('./dev/public/css/*.css', function() {
    gulp.run('styles');
  });
});