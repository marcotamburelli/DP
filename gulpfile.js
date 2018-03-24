var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var tsify = require('tsify');
var uglify = require('gulp-uglify');

function createBundle() {
  return browserify('./src/dp.ts', { standalone: "dp" })
    .plugin(tsify, { target: 'es6' })
    .transform('babelify', { presets: ["env"], extensions: ['.ts'] })
    .bundle();
}

gulp.task('build', function () {
  return createBundle()
    .pipe(source('dp.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./bundle'));
});

gulp.task('min', function () {
  return createBundle()
    .pipe(source('dp.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./bundle'));
});

gulp.task('bundle', ['build', 'min']);
