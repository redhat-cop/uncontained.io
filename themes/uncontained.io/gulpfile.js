var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

gulp.task('sass', function (done) {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./static/dist/css'));
});

gulp.task('watch', function (done) {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  done();
});

gulp.task('default', gulp.parallel('sass'));
