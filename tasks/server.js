'use strict';

const gulp = require('gulp');
const bs = require('browser-sync').create('server');

gulp.task('server', () => {
  bs.init({
    server: {
      baseDir: './dist',
    },
  })
});