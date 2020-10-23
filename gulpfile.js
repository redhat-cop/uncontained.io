var assert = require('assert');
var gulp = require('gulp');
var {spawn} = require('child_process');
var hugoBin = require('hugo-bin');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var BrowserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var linkChecker = require('./test/link-checker');
var depcheck = require('depcheck');
var toml = require('toml');
var lunr = require('lunr');
var fs = require('file-system');

var CONTENT_PATH_PREFIX = "site/content";
var PWD = process.cwd();
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

gulp.task("search", (cb) => {
  const documents = JSON.parse(fs.readFileSync("dist/index.json"));

  var store = {};

  let lunrIndex = lunr(function() {
    this.field("title", {
      boost: 10
    });
    this.field("content");
    this.ref("uri");

    documents.forEach(function(doc) {
      // console.log(doc);
      this.add(doc);

      //add info to store
      store[doc.uri] = { title: doc.title, summary: doc.summary };
    }, this);
  });

  fs.writeFileSync(
    "dist/lunr-index.json",
    JSON.stringify({ index: lunrIndex, store: store })
  );
  cb();
});

gulp.task("build", gulp.series(gulp.parallel("sass", "js", "fonts", "asciidoctor-check"), "hugo", "search"));
gulp.task("build-preview", gulp.series(gulp.parallel("sass", "js", "fonts", "asciidoctor-check"), "hugo-preview", "search"));

// Run server tasks
gulp.task("server", gulp.series("build", (cb) => runServer(cb)));
gulp.task("server", gulp.series("build-preview", (cb) => runServer(cb)));

// Run Automated Tests
gulp.task("smoke", gulp.series((cb) => runSmokeTest(cb)));
gulp.task("linkcheck", gulp.series((cb) => runTests(cb)));
gulp.task("depcheck", gulp.series((cb) => runDepcheck(cb)));
gulp.task("test", gulp.series("build", gulp.parallel("linkcheck", "depcheck")));

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    ui: false,
    open: false
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

  return spawn(hugoBin, args, {stdio: "inherit", shell: "/bin/bash"}).on("close", (code) => {
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
    ui: false,
    open: false
  }, cb);

}

function runSmokeTest(cb) {
  var siteUrl
  if (process.env.TEST_URL === undefined) {
    siteUrl = 'http://localhost:3000/';
  }
  else {
    siteUrl = process.env.TEST_URL
  }

  var checker = new linkChecker();
  checker.run(siteUrl, linkCheckerOptions)
  cb();
}

function runDepcheck(cb) {
  var options = {
    withoutDev: false, // [DEPRECATED] check against devDependencies
    ignoreBinPackage: false, // ignore the packages with bin entry
    skipMissing: false, // skip calculation of missing dependencies
    ignoreDirs: [ // folder with these names will be ignored
      'dist'
    ],
    ignoreMatches: [ // ignore dependencies that matches these globs
      'bootstrap',
      'eslint'
    ],
    parsers: { // the target parsers
      '*.js': depcheck.parser.es6,
      '*.jsx': depcheck.parser.jsx
    },
    detectors: [ // the target detectors
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration
    ],
    specials: [ // the target special parsers
      depcheck.special.eslint,
      depcheck.special.webpack
    ],
  };

  depcheck(PWD, options, (unused) => {
    console.log("Dependency Analysis: \n" + JSON.stringify(unused, null, 2)); // a lookup indicating each dependency is used by which files

    // an array containing the unused dependencies
    assert(isEmpty(unused.dependencies),
      "There are unused dependencies. Please clean them up: " + unused.dependencies)
    // an array containing the unused devDependencies
    assert(isEmpty(unused.devDependencies),
      "There are unused devDependencies. Please clean them up: " + unused.devDependencies)
    // a lookup containing the dependencies missing in `package.json` and where they are used
    assert(isEmpty(unused.missing),
      "You are missing some dependencies: " + unused.missing)
    // files or directories that cannot access or parse
    assert(isEmpty(unused.invalidFiles) && isEmpty(unused.invalidDirs),
      "There are some files that cannot be accessed or parsed: " + unused.invalidFiles + unused.invalidDirs)
  })
    .catch(error => {
      console.log(error)
      process.exit(1);
    });
  cb();
}

function isEmpty(obj) {
  if (Array.isArray(obj)) {
    return obj.length == 0
  }

  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
