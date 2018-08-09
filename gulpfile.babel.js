import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Some debugging
gutil.log("Current dir:" + process.env.PWD);

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
gulp.task("server", ["hugo", "sass", "js", "fonts", "asciidoctor-check"], (cb) => runServer(cb));
gulp.task("server-preview", ["hugo-preview", "sass", "js", "fonts", "asciidoctor-check"], (cb) => runServer(cb));

// Build/production tasks
gulp.task("build", ["sass", "js", "fonts", "asciidoctor-check"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["sass", "js", "fonts", "asciidoctor-check"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

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
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
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

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./site/themes/*/src/**/*.scss", ["sass"])
  gulp.watch(["./site/**/*", "!./site/themes/*/src/**"], ["hugo"]);
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
