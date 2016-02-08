var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'); //works with chrome extension

var env, jsSources, sassSources, htmlSources, outputDir, sassStyle;

env = process.env.NODE_ENV || "development";

if (env === 'development'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}
console.log(sassStyle);

jsSources = [
      'components/scripts/script.js',
    ];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
    // .pipe(plugins.livereload());
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(livereload()) //works with chrome extension
    // .pipe(connect.reload())
    // .pipe(plugins.livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/images/*.png', ['images']);
});


//server
gulp.task('connect', function() {
  connect.server({
    root: outputDir,
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
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env==='production', minifyHTML()))
    .pipe(gulpif(env==='production', gulp.dest(outputDir)))
    .pipe(livereload())
});

gulp.task('images', function(){
  gulp.src('builds/development/images/*.png')
    .pipe(gulpif(env==='production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env==='production', gulp.dest(outputDir + 'images')))
    .pipe(livereload())
})


gulp.task('default', ['html', 'js', 'compass', 'images', 'connect', 'watch']);
