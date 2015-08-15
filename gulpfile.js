var path = require('path');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
var compass = require('gulp-compass');


var publicPath = './public';
var app = {};
app.base    = path.join(publicPath,'app');
app.css     = path.join(publicPath,'css');
app.dest    = path.join(publicPath,'js');
app.bower    = path.join(publicPath,'bower');

app.src    = path.join(app.base,'bootstrap.js');
app.styles    = path.join(app.base,'styles');
app.templates    = path.join(app.base,'templates');



/**
* browserify 编译
*/

gulp.task('scripts', function() {
    gulp.src(app.src)
    .pipe(browserify({
    	shim: { 
    		// angular: {
    		// 	path: path.join(app.bower,'angular/angular.js'),
    		// 	exports: 'angular'
    		// },
        },
    })).on('error',errorHandler)
    .pipe(gulp.dest(app.dest))
    .pipe(livereload());
});



/**
* sass 编译
*/
gulp.task('styles', function() {
    return gulp.src(app.styles + '/**/*.scss')
    .pipe(compass({
        config_file: 'public/config.rb',
        css: app.css,
        sass: app.styles,
        image: path.join(app.css,'images')
    })).on('error',errorHandler)
    .pipe(gulp.dest(app.css))
    // .pipe(livereload());
});



/**
* 默认任务
*/
gulp.task('default',['scripts','styles'],function(){
    gulp.watch(app.base + '/**/**/*.js', ['scripts']);
    gulp.watch(app.styles + '/**/*.scss', ['styles']);

    gulp.watch([
        publicPath + '/index.html',
        path.join(app.templates,'**/*.html'),
        path.join(app.css,'app*')
        ],function(){
        }).on('change',livereload.changed);




});



function errorHandler(error){
    console.error(error.message)
    this.emit('end');
}