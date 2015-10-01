var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var changed = require('gulp-changed');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');
//var rollup = require('rollup');
//var rename = require('gulp-rename');
//var uglify = require('gulp-uglify');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');


var compilerOptions = {
  modules: 'system',
  moduleIds: false,
  comments: true,
  compact: false,
  stage: 1,
  optional: ["runtime"]
};

var path = {
  source: 'src/**/*.js',
  output: 'dist/',
  release: 'release/',
};

var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

//
// Compile Tasks
// ------------------------------------------------------------
gulp.task('es6', function () {
  return gulp.src(path.source)
    .pipe(plumber())
    .pipe(changed(path.output, { extension: '.js' }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel(compilerOptions))
    .pipe(ngAnnotate({
      gulpWarnings: false
    }))
    .pipe(sourcemaps.write("/sourcemaps", { sourceRoot: '/src' }))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function () {
  return gulp.src([path.output, path.release])
    .pipe(vinylPaths(del));
});

//
// Dev Mode Tasks
// ------------------------------------------------------------
gulp.task('serve', ['es6'], function (done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

gulp.task('watch', ['serve'], function () {
  var watcher = gulp.watch([path.source], ['es6']);
  watcher.on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

//
// Release Tasks
// ------------------------------------------------------------

gulp.task('release', function (callback) {
  return runSequence(
    'clean',
    'release-build',
    callback
    );
});

gulp.task('release-build', function () {
  return rollup.rollup({
    entry: 'src/dataTable.js',
    external: ['angular']
  }).then(function (bundle) {
    return bundle.write({
      dest: 'release/dataTable.es6.js',
      format: 'es6',
      moduleName: 'DataTable'
    });
  });
});
