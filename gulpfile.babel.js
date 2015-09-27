import gulp       from 'gulp';
import webpack    from 'webpack';
import eslint     from 'eslint/lib/cli';
import run        from 'run-sequence';
import gutil      from 'gulp-util';
import { exec }   from 'child_process';
import del        from 'del';

import gulpConfig from './build/gulp.config';

// Task name to compile production assets
const prodBuildTask = 'build';

// Task name to start dev server
const startDevTask = 'start:dev';

// Task name to start local server with production assets
const startProdTask = 'start:prod';

// Defining environment
const isDevBuild = process.argv.indexOf(startDevTask) !== -1;

// Defining default task
const startTask = isDevBuild ? startDevTask : prodBuildTask;

// Importing gulp config (it's function, returns an object)
const config = gulpConfig(isDevBuild);

/* Run tasks */

// Using `run-sequence` plugin to group [async tasks] in [sync groups of async tasks]
// 1 group: Cleaning public folder and linting scripts
// 2 group: Compiling assets and copying static stuff (fonts, favicon etc.) to public folder
// 3 group: Starting local Express servers

gulp.task('default', [startTask]);

gulp.task(prodBuildTask, done => {
  run(['clean', 'lint'], ['bundle', 'copy'], done);
});

gulp.task(startDevTask, done => {
  run(['clean', 'lint'], ['bundle', 'copy'], ['server'], done);
});

gulp.task(startProdTask, done => {
  run(['clean', 'lint'], ['bundle', 'copy'], ['server'], done);
});

/* Node server starters */

// Helper to start Express servers from gulp
const startServer = (serverPath, done) => {
  // Defining production environment variable
  const prodFlag = !isDevBuild ? 'NODE_ENV=production' : '';

  // Starting the server
  const server = exec(`NODE_PATH=. ${prodFlag} node ${serverPath}`);

  // Handling messages from server
  server.stdout.on('data', data => {
    // Checking if it's a message from webpack dev server
    // that initial compile is finished
    if (done && data === 'Webpack: Done!') {
      // Notifying gulp that assets are compiled, this task is done
      done();
    } else {
      // Just printing output from server to console
      gutil.log(data.trim());
    }
  });

  // If there is an error - printing output to console and doing the BEEP
  server.stderr.on('data', data => {
    gutil.log(gutil.colors.red(data.trim()));
    gutil.beep();
  });
};

/* Build bundles */

gulp.task('bundle', done => {
  if (isDevBuild) {
    // Starting webpack dev server
    startServer('server.dev.js', done);
  } else {
    // Just compiling assets
    webpack(config.webpack).run(done);
  }
});

/* Start express servers */

gulp.task('server', done => {
  const servers = config.server.paths;
  let queue     = servers.length;

  servers.forEach(server => {
    startServer(server);
    if (--queue === 0) done();
  });
});

/* Copy files to 'public' */

gulp.task('copy', done => {
  const files = config.copy.files;
  let   queue = files.length;

  files.forEach(file => {
    const from = config.copy.from + file[0];
    const to   = config.copy.to + (file[1] || file[0]);
    exec(`cp -R ${from} ${to}`, err => {
      if (err) {
        gutil.log(gutil.colors.red(err));
        gutil.beep();
      }
      if (--queue === 0) done();
    });
  });
});

/* Lint scripts */

gulp.task('lint', done => {
  eslint.execute('--ext .js,.jsx .');
  done();
});

/* Clean up public before build */

gulp.task('clean', done => {
  del(['./public/**/*'], done);
});
