// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const babel = require('gulp-babel');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');


// File where the favicon markups are stored
const FAVICON_DATA_FILE = 'faviconData.json';

// File paths
const files = { 
    scssPath: ['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss', 'src/scss/**/*.scss'],
    jsPath: ['src/js/*'],
    njkPath: ['src/pages/**/*.+(html|njk)', 'src/templates/**/*.+(html|njk)']
}

const fileWatch = files.scssPath.concat(files.jsPath.concat(files.njkPath));

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('app/css')
    ); // put final CSS in app folder
}

// JS compile to ES5 and copy task
function jsCompile() {
    return src(files.jsPath)
        .pipe(babel({
            presets: ['@babel/env']
        })) // compile to ES5
        .pipe(dest('app/js')) // put compiled JS in app folder
}

// Use the templating engine to render files
function nunjucks() {
    // Gets .html and .nunjucks files in pages
    return src(files.njkPath[0])
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: ['src/templates']
    }))
    // output files in app folder
    .pipe(dest('app'))
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    console.log(fileWatch);
    watch(fileWatch, series(
        parallel(scssTask, jsCompile, nunjucks),
        injectFaviconMarkups,
        browserSyncReload
        )
    );    
}

// Intitalize browser sync
function serve() {
    browserSync.init({
        server: "./app"  
    });
}

// BrowserSync Reload
function browserSyncReload(done) {
    browserSync.reload();
    done();
  }


// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
function genFavicon(done) {
    realFavicon.generateFavicon({
        masterPicture: 'src/favicon/favicon_master.png',
        dest: 'app/assets/favicons',
        iconsPath: '/assets/favicons',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
}
  
// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
function injectFaviconMarkups() {
    return src([ 'app/*.html' ])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(dest('app'));
}
  
// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
function checkForFaviconUpdate(done) {
    const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    })
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, jsCompile, nunjucks),
    injectFaviconMarkups,
    parallel(serve, watchTask)
);

exports.checkForFaviconUpdate = checkForFaviconUpdate;
exports.genFavicon = genFavicon;
exports.injectFaviconMarkups = injectFaviconMarkups;