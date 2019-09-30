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

// File paths
const files = { 
    scssPath: ['node_modules/bootstrap/scss/bootstrap.scss', 'app/scss/*.scss'],
    jsPath: ['app/js/*'],
    njkPath: ['app/pages/**/*.+(html|njk)', 'app/templates/**/*.+(html|njk)']
}

const fileWatch = files.scssPath.concat(files.jsPath.concat(files.njkPath));

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('app/css')
    ); // put final CSS in dist folder
}


// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    console.log(fileWatch);
    watch(fileWatch, series(
        parallel(scssTask, nunjucks),
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

// Use the templating engine to render files
function nunjucks() {
    // Gets .html and .nunjucks files in pages
    return src(files.njkPath[0])
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: ['app/templates']
    }))
    // output files in app folder
    .pipe(dest('app'))
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, nunjucks),
    parallel(serve, watchTask)
);