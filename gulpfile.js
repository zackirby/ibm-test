var gulp = require('gulp'); // for gulp
var sass = require('gulp-sass'); // for sass
var browserSync = require('browser-sync').create(); // for live css reload
var cache = require('gulp-cache'); // cache proxy
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

// watch for reload
gulp.task('watch', function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', ['useref']);
});

gulp.task('default', function(callback){
	runSequence( ['browserSync', 'sass', 'watch'], 
		callback
	)
});

// build files
gulp.task('build', function(callback){
	runSequence('sass',
		callback
	)
});