const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('mini', () => (
  gulp.src('src/xhr.js')
  .pipe(rename("xhr.js"))
  .pipe(gulp.dest('dist/'))
  .pipe(uglify())    //uglify
  .pipe(rename("xhr.min.js"))
  .pipe(gulp.dest('dist/'))
));