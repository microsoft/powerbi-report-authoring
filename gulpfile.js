var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

var del = require('del'),
    flatten = require('gulp-flatten'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    saveLicense = require('uglify-save-license')
    sourcemaps = require('gulp-sourcemaps'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config')
;

// Build the license comment.
var package = require('./package.json');
var webpackBanner = package.name + " v" + package.version + " | (c) 2019 Microsoft Corporation " + package.license;
var gulpBanner = "/*! " + webpackBanner + " */\n";

gulp.task("compile:ts", function () {
    let src = gulp.src(['./src/*.ts']);

    webpackConfig.plugins = [
      new webpack.BannerPlugin(webpackBanner)
    ];

    return src
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest("dist"));
});

// Add header to distributed files
gulp.task('header', function () {
  return gulp.src(['./dist/*.d.ts'])
    .pipe(header(gulpBanner))
    .pipe(gulp.dest('./dist'));
});

// Minify build files
gulp.task('min', function () {
  return gulp.src(['!./dist/*.min.js', './dist/powerbi-report-authoring.js'])
    .pipe(uglify({
        output: {
            comments: saveLicense
        }
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/'));
});

// Clean dist folder
gulp.task('clean:dist', function () {
  return del([
    './dist/**/*'
  ]);
});

// Keep this last. Order matters.
gulp.task('build',
  gulp.series(
    //'tslint:build',
    'clean:dist',
    'compile:ts',
    'min',
    'header',
    function (done) { done(); }
  )
);
