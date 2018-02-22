var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');
var tsify = require('tsify');
var uglify = require('gulp-uglify');

function createBundle() {
  return browserify('./src/XLib.ts', { standalone: "XLib" })
    .plugin(tsify, { target: 'es6' })
    .transform(babel, { presets: ["es2015"], extensions: ['.ts'] })
    .bundle();
}

gulp.task('build', function () {
  return createBundle()
    .pipe(source('xlib.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./bundle'));
});

gulp.task('min', function () {
  return createBundle()
    .pipe(source('xlib.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./bundle'));
});

gulp.task('bundle', ['build', 'min']);
