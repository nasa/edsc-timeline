var gulp        = require('gulp'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    del         = require('del'),
    less        = require('gulp-less'),
    sourcemaps  = require('gulp-sourcemaps'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    rename      = require("gulp-rename"),
    watch       = require('gulp-watch'),
    batch       = require('gulp-batch');

var emitError = function(err) {
  gutil.log(gutil.colors.red("Error:"), err);
  gutil.beep();
  this.emit('end');
};

gulp.task('clean', function() {
  return del(['./dist', './tmp']);
});

gulp.task('less', function () {
  return gulp.src('./src/css/timeline.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', emitError)
    .pipe(rename('edsc-timeline.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('compile', function() {
  var b = browserify({
    extensions: ['.js', '.coffee'],
    debug: true
  });
  b.add('./src/js/timeline.coffee');

  return b.bundle()
    .on('error', emitError)
    .pipe(source('edsc-timeline.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', function () {
  watch('src/**/*', batch(function (events, done) {
    gulp.start('build', done);
  }));
});

gulp.task('build', ['compile', 'less']);

gulp.task('default', ['build']);
