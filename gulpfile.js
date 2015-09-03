var gulp        = require('gulp'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    del         = require('del'),
    less        = require('gulp-less'),
    sourcemaps  = require('gulp-sourcemaps'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    rename      = require("gulp-rename");

gulp.task('clean', function() {
  return del(['./dist', './tmp']);
});

gulp.task('less', function () {
  return gulp.src('./src/css/timeline.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(rename('edsc-timeline.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('compile', function() {
  var b = browserify({
    entries: ['./src/js/timeline.coffee'],
    extensions: ['.coffee'],
    debug: true
  });

  return b.bundle()
    .pipe(source('edsc-timeline.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('build', ['compile', 'less']);

gulp.task('default', ['build']);
