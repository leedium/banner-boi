var gulp = require('gulp');
var config = require('../config').assemble;
var assemble = require('assemble');
var extname = require('gulp-extname');
var gulpAssemble = require('gulp-assemble');

gulp.task('assemble', function () {
    assemble.layouts(config.options.layouts);
    assemble.partials(config.options.partials);
    return gulp.src(config.src)
        .pipe(gulpAssemble(assemble,{layout:'default'}))
        .pipe(extname())
        .pipe(gulp.dest(config.dest));
});