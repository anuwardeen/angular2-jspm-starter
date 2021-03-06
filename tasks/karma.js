'use strict';

const _ = require('lodash');
const gulp = require('gulp');
const notify = require('gulp-notify');
const through = require('through');
const path = require('path');
const Server = require('karma').Server;
const argv = require('yargs').argv;

const jspmConfig = {
  baseURL: './.tmp',
  config: 'jspm.config.js',
  loadFiles: [
    '.tmp/**/*.spec.js',
  ],
  serveFiles: [
    '.tmp/**/!(*.spec).js',
  ],
};

function buildServer(options, done) {
  return new Server(_.assign({
    configFile: path.join(__dirname + '/../karma.conf.js')
  }, options), done);
}

/**
 * Run test once and exit
 */
gulp.task('karma:watch', (done) => {
  const fileOveride = (argv.file) ? { loadFiles: [argv.file] } : {};

  const server = buildServer(_.assign({
    singleRun: false,
    watch: true,
    jspm: _.assign(jspmConfig, fileOveride),
  }), () => {
    done();
  });

  server.on('run_complete', (browser, results) => {
    if (results.error) {
      gulp.src('.')
      .pipe(through(function () {
        this.emit('error', new Error('Test failed!'))
      }))
      .on('error', notify.onError('<%= error.message %>'));
    }
  });

  return server.start();
});

/**
 * Run test once and exit
 */
gulp.task('karma', (done) => {
  return buildServer({ jspm: jspmConfig }, done).start();
});
