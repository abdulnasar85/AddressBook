var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var cssmin = require('gulp-cssmin');
var path = require('path');
 
gulp.task('compileLess', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('cssmin', ['compileLess'], function () {
    gulp.src('./css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
    gulp.watch('./less/**/*.less', ['cssmin']);
});

gulp.task('package', [ 'cssmin', 'watch' ]);
