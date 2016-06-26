var gulp 			= require('gulp');
var concat			= require('gulp-concat');
var uglify 			= require('gulp-uglify');
var pump 			= require('pump');
var del 			= require('del');
var browserSync		= require('browser-sync').create();
var runSequence		= require('run-sequence');

var baseAppDir 		= 'src/';
var distDir 		= 'dist/';

var depsCSS			= 	[
							'bower_components/bootstrap/dist/css/bootstrap.min.css'
						];

var depsJS 			= 	[
							'bower_components/jquery/dist/jquery.min.js',
							'bower_components/bootstrap/dist/js/bootstrap.min.js',
							'bower_components/angular/angular.min.js',
							'bower_components/d3/d3.min.js'
						];

var appJS 			= 	[
							baseAppDir + 'js/*.js'
						];

/**
 * Build Task
 * Dependencies JavaScript
 */
gulp.task('buildDepJS', function(){
	var deps = gulp.src(depsJS);
	return deps.pipe(concat(baseAppDir + 'd3js1_deps.js'))
		.pipe(gulp.dest(''));
});

/**
 * Build Task
 * Application JavaScript
 */
gulp.task('buildAppJS', function(){
	var app = gulp.src(appJS);
	return app.pipe(concat(baseAppDir + 'd3js1.js'))
		.pipe(gulp.dest(''));
});

/**
 * Build Task
 * Dependencies CSS
 */
gulp.task('buildCSSDeps', function(){
	return gulp.src(depsCSS)
		.pipe(concat(baseAppDir + 'd3js1_deps.css'))
		.pipe(gulp.dest(''));
});

/**
 * Build Task
 * Application CSS
 */
gulp.task('buildCSS', function(){
	return gulp.src([
			baseAppDir + 'css/styles.css'
		])
		.pipe(concat(baseAppDir + 'd3js1.css'))
			.pipe(gulp.dest(''));
});

/**
 * Build Task
 * 	Run Sequence to complete Simple Build
 **/
gulp.task('build', function(cb){
	runSequence([
			'buildDepJS',
			'buildAppJS',
			'buildCSSDeps',
			'buildCSS'],
		cb
	);
});

/**
 * Distribution Task
 *	Creates a combined Dependencies JavaScript file
 **/
gulp.task('distDepJS', function(){
	var deps = gulp.src(depsJS);
	return deps.pipe(concat(distDir + 'd3js1_deps.js'))
		.pipe(gulp.dest(''));
});

/**
 * Distribution Task
 * 	Creates a combined Minified Application JavaScript file
 * 	This task uses pump to test its functionality
 **/
gulp.task('distAppJS', function(cb){
	pump([
			gulp.src(appJS),
			uglify(),
			concat('d3js1.js'),
			gulp.dest('dist')
		],
		cb
	);
});

/**
 * Distribution Task
 * 	Creates the Dependencies CSS
 **/
gulp.task('distCSSDeps', function(){
	return gulp.src([
		'bower_components/bootstrap/dist/css/bootstrap.min.css'
	])
		.pipe(concat(distDir + 'd3js1_deps.css'))
		.pipe(gulp.dest(''));
});

/**
 * Distribution Task
 *	Creates the Application CSS
 **/
gulp.task('distCSS', function(){
	return gulp.src([
		baseAppDir + 'css/styles.css'
	])
		.pipe(concat(distDir + 'd3js1.css'))
		.pipe(gulp.dest(''));
});

/**
 * Distribution Task
 *	Cleans the Distribution folder
 **/
gulp.task('clean:dist', function(){
	return del([
		'dist/**/*',
		'!dist/data/PGADriving.json'
	]);
});

/**
 * Distribution Task
 * 	Run Sequence to complete Distribution
 * 	Clears the dist folder
 **/
gulp.task('dist', function(){
	runSequence([
		'clean:dist',
		'distDepJS',
		'distAppJS',
		'distCSSDeps',
		'distCSS'],
		function(){
			return gulp.src([
				baseAppDir + '*.html',
				baseAppDir + '**/*.json'
			])
				.pipe(gulp.dest(distDir));
		});
});

/**
 * Browser Sync Task to Live Reload Build
 */
gulp.task('browser-sync', function() {
	var reload      = browserSync.reload;

	// Uses default port 3000
	browserSync.init({
		server: './src'
	});

	gulp.watch(['src/*.html', 'src/**/*.js', 'src/**/*.css']).on("change", reload);
});

/**
 * Browser Sync Task to Live Reload Distribution
 */
gulp.task('browser-sync-dist', function() {
	var reload      = browserSync.reload;

	browserSync.init({
		server: './dist/',
		port: 5000
	});

	gulp.watch(['dist/*.html', 'dist/**/*.js', 'dist/**/*.css']).on("change", reload);
});
