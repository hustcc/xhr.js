var fs = require('fs');
var gulp = require('gulp');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var injectVersion = require('gulp-inject-version');

gulp.task('mini', function() {
  var src = fs.readFileSync('./src/xhr.js', 'utf8');

  gulp.src('src/exports.js')
    .pipe(replace('{{ SOURCE_CODE }}', src))
    .pipe(injectVersion())
    .pipe(rename("xhr.js"))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify({
      preserveComments: 'license'
    }))    //uglify
    .pipe(rename("xhr.min.js"))
    .pipe(gulp.dest('dist/'));
});
