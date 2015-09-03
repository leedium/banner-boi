var gulp = require('gulp');

gulp.task('default', ['iconFont'], function() {
   // gulp.start('sass', 'images', 'assemble', 'markup', 'watch');
    gulp.start('assemble', 'sass', 'images',  'watch');
});
