var browserify  = require('browserify'),
    del         = require('del'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    batch       = require('gulp-batch'),
    less        = require('gulp-less'),
    license     = require('gulp-license'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    watch       = require('gulp-watch'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer');

var emitError = function(err) {
  gutil.log(gutil.colors.red("Error:"), err);
  gutil.beep();
  this.emit('end');
};

gulp.task('clean', function() {
  return del(['./dist', './tmp']);
});

gulp.task('less', function () {
  var pkg = JSON.parse(fs.readFileSync('./package.json')),
      path = './src/css/' + pkg.name + '.less';
  if (fs.existsSync(path)) {
    return gulp.src(path)
      .pipe(sourcemaps.init())
      .pipe(less())
      .on('error', emitError)
      .pipe(license('apache', pkg.copyright))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css/'));
  }
  else {
    return gutil.noop();
  }
});

gulp.task('compile', function() {
  var pkg = JSON.parse(fs.readFileSync('./package.json')),
      path = './src/js/' + pkg.name + '.coffee',
      b;

  if (fs.existsSync(path)) {
    b = browserify({
      extensions: ['.js', '.coffee'],
      debug: true
    });
    b.add(path);

    return b.bundle()
      .on('error', emitError)
      .pipe(source(pkg.name + '.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(license('apache', pkg.copyright))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js/'));
  }
  else {
    return gutil.noop();
  }
});

gulp.task('watch', function () {
  watch('src/**/*', batch(function (events, done) {
    gulp.start('build', done);
  }));
});

gulp.task('build', ['compile', 'less']);

gulp.task('default', ['build']);
