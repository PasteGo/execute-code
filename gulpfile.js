const gulp       = require("gulp");
const clean      = require('gulp-clean');
const concat     = require('gulp-concat');
const htmlmin    = require('gulp-html-minifier');
const merge      = require('merge-stream');
const rename     = require("gulp-rename");
const uglify     = require('gulp-uglify-es').default;
const minifycss  = require("gulp-minify-css");

const distDIR = "./dist";

function cleanFile(source) {
    return gulp.src(source)
               .pipe(clean({force: true}));
}

function cleanDist() {
    return cleanFile([distDIR + "/*"]);
}

function jsMini(src, dist) {
	return gulp.src(src)
		.pipe(gulp.dest(dist))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify())
        .pipe(gulp.dest(dist))
}

function cssMini(src, dist) {
    return gulp.src(src)
        .pipe(gulp.dest(dist))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(gulp.dest(dist))
}

function gao() {
    return merge(
        jsMini("./src/*.js", distDIR),
        cssMini("./src/*.css", distDIR)
    );
}

exports.cleanDist = cleanDist;
exports.gao = gao;
exports.default = gulp.series(
	cleanDist, 
	gao
);

