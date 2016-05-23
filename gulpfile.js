var gulp 			= require('gulp'),
	plumber 		= require('gulp-plumber'),
	sass 			= require('gulp-sass'),
	jshint			= require('gulp-jshint'),
	concat			= require('gulp-concat'),
	changed 		= require('gulp-changed'),
	browserSync 	= require('browser-sync'),
	reload			= browserSync.reload,
	cleanCSS 		= require('gulp-clean-css'),
	uglify 			= require('gulp-uglify');

var SRC 			= 'resources/**/app.*',
	DEST 			= 'public';



// --------------------
// Tasks
// --------------------
gulp.task('dev', ['styles', 'script']);
gulp.task('script', ['jshint', 'concat']);
gulp.task('default', ['dev', 'server']);

gulp.task('production', ['miniCss', 'uglify']);

// --------------------
// Defaut
// --------------------
// Styles
gulp.task('styles', function() {
	console.log('|1/4|► ' + ' Compiling & serving STYLE files ←---');
	return  gulp.src('resources/*.scss')
	.pipe(sass())
	.pipe(gulp.dest(DEST));
});

// Scripts
gulp.task('jshint', function() {
	console.log('|2/4|► ' + ' Checking all JS files ←---');
	return  gulp.src('resources/js/*.js')
	.pipe(plumber())
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('concat', function() {
	console.log('|3/4|► ' + ' Compiling SCRIPT files ←---');
	return gulp.src('resources/assets/**/**/*.js')
	.pipe(plumber())
	.pipe(concat('App.js'))
	.pipe(gulp.dest('public'))
	.pipe(gulp.dest('resources'));
});

// --------------------
// Server
// --------------------
gulp.task('server', function() {
	console.log('|4/4|► ' + ' Watching files & syncing browser ←---');
	browserSync.init({
		server: DEST
	});
	gulp.watch("resources/**", ['dev']);
	gulp.watch("resources/**").on('change', reload);
});

// --------------------
// Production
// --------------------
gulp.task('miniCss', function() {
	console.log('|1/2|► ' + ' Compressing CSS ←---');
	return gulp.src('public/*.css')
	.pipe(plumber())
	.pipe(cleanCSS({
		keepSpecialComments: 1
	}))
	.pipe(gulp.dest(DEST));
});

gulp.task('uglify', function() {
	console.log('|2/2|► ' + ' Compressing SCRIPTS ←---');
	return gulp.src('public/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(gulp.dest(DEST));
});







