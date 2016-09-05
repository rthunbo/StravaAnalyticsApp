'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sequence = require('run-sequence');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/**
 * Configuration
 */

var config = {
    publicDir: './public'
};

//helper functions
function runNodemon (path, cb) {
    var started = false;
    return nodemon({
        script: path,
        ignore: ['public/**/*.js', 'node_modules/**/*.*']
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
}

function startBrowserSync (arrayOfPaths) {
    browserSync.init(null, {
        proxy: 'http://localhost:8080',
        files: arrayOfPaths,
        browser: 'google chrome',
        port: 3000
    });

}

/**
 * Entrance Points
 */

// default task used when you run `gulp` or `gulp default` from cli
gulp.task('default', function (callback) {
    sequence('serve', callback);
});

/**
 * Tasks
 */

//serve / browser sync
gulp.task('serve', ['nodemon'], function () {
    startBrowserSync(['./public/**/*.*']);

    gulp.watch(['./public/views/**/*.html', './public/index.html']).on('change', browserSync.reload);
    gulp.watch('./public/**/*.js', ['js']);
});

//node server
gulp.task('nodemon', function (cb) {
    return runNodemon('server/app.js', cb);
});

// build - for travis
gulp.task('build', function (callback) {
    sequence('js', callback);
});

// JS tasks (client-side)
gulp.task('js', function (callback) {
    sequence('js-lint', callback);
});

gulp.task('js-lint', function () {
    return gulp.src([config.publicDir + '/**/*.js', '!./public/libs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
