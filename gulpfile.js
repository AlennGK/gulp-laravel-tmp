var watchify 			= require('watchify'),
 browserify 			= require('browserify'),
 gulp 					= require('gulp'),
 source 				= require('vinyl-source-stream'),
 buffer 					= require('vinyl-buffer'),
 gutil 					= require('gulp-util'),
 babelify 				= require('babelify'),
 uglify 					= require('gulp-uglify'),
 sourcemaps  			= require('gulp-sourcemaps'),
 assign 				= require('lodash.assign'),
 browserSync 			= require('browser-sync'),
 sass 	 				= require('gulp-sass'),
 autoprefixer			= require('gulp-autoprefixer'),
 gulpif  					= require('gulp-if');

// setup node enviorment (development or production)
var env = process.env.NODE_ENV;

// ////////////////////////////////////////////////
// HTML Tasks
// ////////////////////////////////////////////////

gulp.task('html', function () {
	return gulp.src('public/**/*.html')
		.pipe(browserSync.reload({ stream: true }));
});

// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////

gulp.task('styles', function () {
	console.log('|1/4|► ' + ' Compiling & serving STYLE files ←---');
	gulp.src('src/assets/scss/style.scss')
		.pipe(sourcemaps.init())

			// scss output compressed if production or expanded if development
			.pipe(gulpif(env === 'production', sass({ outputStyle: 'compressed' }),
				sass({ outputStyle: 'expanded' })))
			.on('error', gutil.log.bind(gutil, gutil.colors.red(
				 '\n\n*********************************** \n' +
				'SASS ERROR:' +
				'\n*********************************** \n\n'
				)))
			.pipe(autoprefixer({
				browsers: ['last 3 versions'],
				cascade: false,
			}))
		.pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
.pipe(gulp.dest('public/css'))
.pipe(browserSync.reload({ stream: true }));
});

// ////////////////////////////////////////////////
// Javascript Browserify, Watchify, Babel, React
// ////////////////////////////////////////////////

// add custom browserify options here
var customOpts = {
	entries: ['./src/assets/js/index.js'],
	debug: true,
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
b.transform('babelify', { presets: ['es2015', 'react'] });

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
	console.log('|2/4|► ' + ' Checking all JS files ←---');
	return b.bundle()

		// log errors if they happen
		.on('error', gutil.log.bind(gutil, gutil.colors.red(
			 '\n\n*********************************** \n' +
			'BROWSERIFY ERROR:' +
			'\n*********************************** \n\n'
			)))
		.pipe(source('main.js'))

		// optional, remove if you don't need to buffer file contents
		.pipe(buffer())
		.pipe(gulpif(env === 'production', uglify()))

		// optional, remove if you dont want sourcemaps
		.pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
		// Add transformation tasks to the pipeline here.
		// writes .map file
		.pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.reload({ stream: true }));
}

// ////////////////////////////////////////////////
// Browser-Sync Tasks
// ////////////////////////////////////////////////

gulp.task('browserSync', function () {
	console.log('|3/4|► ' + ' Watching files & syncing browser ←---');
	browserSync({
		server: {
			baseDir: './public/',
		},
	});
});

// ////////////////////////////////////////////////
// Watch Tasks
// ////////////////////////////////////////////////

gulp.task('watch', function () {
	gulp.watch('public/**/*.html', ['html']);
	gulp.watch('src/assets/scss/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'js', 'browserSync', 'watch']);
