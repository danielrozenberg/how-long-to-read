const {dest, parallel, src, task, watch} = require('gulp');
const browserify = require('gulp-browserify');

const JS_SRC_DIRECTORIES = [
  'background_scripts',
  'content_scripts',
  'options_ui',
];

const ALL_SRC_DIRECTORIES = [
  'icons',
  ...JS_SRC_DIRECTORIES,
];

/**
 * Gulp sub-task to copy static files.
 * @param {*} cb gulp task callback function.
 */
function copy(cb) {
  const globs = ALL_SRC_DIRECTORIES.map((directory) => `${directory}/*`);
  src([...globs, 'manifest.json', '!**/*.js'])
      .pipe(dest((file) => `dist/${file.base.substring(file.cwd.length + 1)}`));
  cb();
}
copy.displayName = 'build:copy';

/**
 * Parallel gulp task to build all JavaScript sources and copy static files to
 * a dist/ directory.
 */
exports.build = parallel(
    copy,
    ...JS_SRC_DIRECTORIES.map((directory) => {
      const subTask = () => src(`${directory}/*.js`)
          .pipe(browserify())
          .pipe(dest(`./dist/${directory}`));
      subTask.displayName = `build:${directory}`;
      return subTask;
    }));

exports.watch = task('watch', () => {
  return watch(
      ['**/*', '!dist/*'],
      {
        ignoreInitial: false,
        queue: true,
      },
      exports.build);
});
