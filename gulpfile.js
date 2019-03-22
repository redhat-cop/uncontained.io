var gulp = require('gulp');
var {spawn} = require('child_process');
var hugoBin = require('hugo-bin');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var BrowserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var linkChecker = require('./test/link-checker');

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];
const linkCheckerOptions = {
  filterLevel: 3,
  excludedKeywords: [
    "cluster.local",
    "myorg.com",
    "wiki.jenkins-ci.org"
  ]
};


// Some debugging
gutil.log("Current dir:" + process.env.PWD);

// Development tasks
gulp.task("hugo", gulp.series((cb) => buildSite(cb)));
gulp.task("hugo-preview", gulp.series((cb) => buildSite(cb, hugoArgsPreview)));

// Compile SCSS into CSS
gulp.task("sass", function(done) {
  const sassOpts = {
    outputStyle: "compressed"
  };

  return gulp.src("./site/themes/uncontained.io/src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass(sassOpts).on("error", sass.logError))
    .pipe(sourcemaps.write("./site/themes/uncontained.io/maps"))
    .pipe(gulp.dest("./site/themes/uncontained.io/static/dist/css"));
});

// Compile Javascript
gulp.task("js", (cb) => {
  browserSync.reload();
  cb();
});

// Move all fonts in a flattened directory
gulp.task("fonts", () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Check that asciidoctor is installed
gulp.task("asciidoctor-check", (cb) => {
  const cmd = spawn("asciidoctor");
  cmd.on("exit", function(code, signal) {
    cb();
  });
  cmd.on("error", function(error) {
    if (error.toString() === "Error: spawn asciidoctor ENOENT") {
      cb("Asciidoctor is not installed. Please install asciidoctor or run the build via the included Docker container.");
    } else {
      cb(error);
    }
  });
});

// Run server tasks
gulp.task("server", gulp.series(gulp.parallel("hugo", "sass", "js", "fonts", "asciidoctor-check"), (cb) => runServer(cb)));
gulp.task("server-preview", gulp.series(gulp.parallel("hugo-preview", "sass", "js", "fonts", "asciidoctor-check"), (cb) => runServer(cb)));

// Build/production tasks
gulp.task("build", gulp.series(gulp.parallel("sass", "js", "fonts", "asciidoctor-check"), (cb) => buildSite(cb, [], "production")));
gulp.task("build-preview", gulp.series(gulp.parallel("sass", "js", "fonts", "asciidoctor-check"), (cb) => buildSite(cb, hugoArgsPreview, "production")));

// Run Automated Tests
gulp.task("test", gulp.series((cb) => runTests(cb)));
gulp.task("smoke", gulp.series((cb) => runSmokeTest()));

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./site/themes/*/src/**/*.scss", gulp.parallel(["sass"]));
  gulp.watch(["./site/**/*", "!./site/themes/*/src/**"], gulp.parallel(["hugo"]));
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}

function runTests(cb) {
  process.on('uncaughtException', function (err) {
      console.log(err);
  });
  var min = 10000;
  var max = 65535;
  var portNum = Math.floor(Math.random() * (max - min)) + min;
  testSetup(portNum, function(){
    var siteUrl = "http://localhost:" + portNum + "/";
    var checker = new linkChecker();

    checker.run(siteUrl, linkCheckerOptions);

  });

  cb();
}

function testSetup(port, cb) {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    port: port,
    ui: {
      port: port + 1
    },
    open: false
  }, cb);

}

function runSmokeTest() {
  var siteUrl
  if (process.env.TEST_URL === undefined) {
    siteUrl = 'http://localhost:8080/';
  }
  else {
    siteUrl = process.env.TEST_URL
  }

  var checker = new linkChecker();
  checker.run(siteUrl, linkCheckerOptions)
}
