var gulp = require('gulp'); // for gulp
var sass = require('gulp-sass'); // for sass
var browserSync = require('browser-sync').create(); // for live css reload
var useref = require('gulp-useref'); // file concatenation
var uglify = require('gulp-uglify'); // minify js
var cssnano = require('gulp-cssnano'); // minify css
var gulpIf = require('gulp-if'); // conditionally run a task
var imagemin = require('gulp-imagemin'); // minify images
var cache = require('gulp-cache'); // cache proxy
var del = require('del'); // delete files/folders using globs - needed to delete 'dist' directory before build
var runSequence = require('run-sequence'); // run series of dependent gulp tasks in order

// convert sass to css
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// live reload
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	});
});

// concatenate html partials; concatenate and minify css and js partials
gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

// minify images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});

// move fonts to dist
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

//remove dist folder before build
gulp.task('clean:dist', function(){
	return del.sync('dist')
});

// watch for reload
gulp.task('watch', function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', ['useref']);
});

gulp.task('default', function(callback){
	runSequence( ['browserSync', 'sass', 'useref', 'watch'], 
		callback
	)
});

// build files
gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'],
		callback
	)
});