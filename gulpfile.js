var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'); //works with chrome extension

var jsSources = [
      'components/scripts/script.js',
    ];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
    // .pipe(plugins.livereload());
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'))
    .pipe(livereload()) //works with chrome extension
    // .pipe(connect.reload())
    // .pipe(plugins.livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
});


//server
gulp.task('connect', function() {
  connect.server({
    root: './builds/development/',
    livereload: true
  });
});

// gulp.task('livereload', function () {
//   gulp.src(['index.html', 'resources/**/*.js'])
//     .pipe(watch(['resources/**/*.html', 'index.html']))
//     // .pipe(debug({verbose: true}))
//     .pipe(connect.reload());
// });

gulp.task('html', function() {
  gulp.src(htmlSources)
    .pipe(connect.reload())
    .pipe(livereload())
});


gulp.task('default', ['html', 'js', 'compass', 'connect', 'watch']);
