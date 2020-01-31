var gulp = require('gulp');
var watch = require('gulp-watch');
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var runSequence = require('gulp-run-sequence');
var fileinclude = require('gulp-file-include');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream')
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');

// build tasks

gulp.task('build:clean', function(cb) {
  rimraf('./dist/**/*', cb)
})

gulp.task('build:test', function() {
  var processors = [
    autoprefixer({browsers: ['> 1%']}),
    cssnano()
  ];

  return gulp.src('./src/preview/*.html')
    .pipe(useref())
    .pipe(gulpif('*.css', postcss(processors)))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('./dist/html'));
})

gulp.task('build:move', function() {  
  gulp.src('./bower_components/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('./dist/static/fonts/'));

  gulp.src('./src/static/i/*.png')
    .pipe(gulp.dest('./dist/static/i/'));
})


gulp.task('build', function() {
  runSequence('build:clean', 'build:test', 'build:move');  
})


// dev tasks

gulp.task('dev:css', function() {
  return gulp.src('./src/static/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))    
    .pipe(gulp.dest('./src/static/css/'))
    .pipe(browserSync.stream());    
});

gulp.task('dev:html', function() {
  return gulp.src('./src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./src/preview'))

});

gulp.task('dev:sprite', function () {
  
  var spriteData = gulp.src('./src/static/i/icons/*.png')
    .pipe(spritesmith({    
      imgName: '../i/sprite.png',
      cssName: '_sprite.scss',
      cssVarMap: function (sprite) {
        sprite.name = 'icon-' + sprite.name;
      }
    })
  ); 
  
  var imgStream = spriteData.img
    .pipe(gulp.dest( './src/static/i/')); 
  
  var cssStream = spriteData.css
    .pipe(gulp.dest( './src/static/scss/utils' ));
   
  return merge(imgStream, cssStream);

});

gulp.task('dev:reload', function() {
  browserSync.reload()
})

gulp.task('dev:serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      directory: true
    },
    startPath: 'src/preview'
  });

  watch([
    "./src/static/scss/**/*.scss", 
    "!./src/static/scss/utils/_sprite.scss"
  ], function() {
    runSequence('dev:sprite', 'dev:css');
  });

  watch("./src/static/js/**/*.js", function() {
    runSequence('dev:reload');
  });

  watch("./src/html/**/*.html", function() {
    runSequence('dev:html', 'dev:reload');
  })
})


gulp.task('dev', function() {
  runSequence('dev:sprite', ['dev:html', 'dev:css'], 'dev:serve')  
})