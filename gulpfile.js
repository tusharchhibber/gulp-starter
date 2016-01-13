// 
//  Required
// 

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	compass = require('gulp-compass'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),   //plugin used to delete files/folders
	rename = require('gulp-rename');

// 
//  Scripts Task
// 
gulp.task('scripts', function() {
    // content
    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

// 
//  Compass / Sass Task 
//  It will create style.css file in css folder from what is there in scss/style.scss file
//  
//  We can fiddle with whether we want our css to be compressed or enhanced in config.rb file
//  
//  If it was not for plumber, any error thrown on gulp watch would result in stopping of gulp watch
//  	which is less than ideal. plumber() should be piped right after gulp.src
//  
//  autoprefixer adds vendor prefixes
// 
gulp.task('compass', function(){
	gulp.src(['app/scss/style.scss'])
	.pipe(plumber())
	.pipe(compass({
		config_file: './config.rb',
		css: 'app/css',
		sass: 'app.scss',
		require: ['susy']
	}))
	.pipe(autoprefixer('last 2 versions'))
	.pipe(gulp.dest('app/css/'))
	.pipe(reload({stream: true}));  // Set reload stream to true for browser sync. Always add it at last
});

// 
//  HTML Task
//  Since the reload is added here too, any change in html will also be reflected in browser
// 
gulp.task('html', function() {
	gulp.src('app/**/*.html')
	.pipe(reload({stream: true}));
});


// 
//  Build Task
//  
//  

// clear out all files and folders from build folder
gulp.task('build:cleanfolder', function(cb) {
	return del([
		'build/**'
	], cb);
});


//Task to cereate build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function(cb) {
	return gulp.src('app/**/*')
		.pipe(gulp.dest('build/'), cb);

});

//task to remove unwanted build files
//list all files and directories here that you don't want to include
gulp.task('build:remove', ['build:copy'], function(){
	del([
		'build/scss',
		'build/js/!(*.min.js)'
	]);
});

//Parent build task like default task to kick off build:remove (which in return will want to run build:copy first
//that will want to run build:cleanfolder first)
gulp.task('build', ['build:remove']);



// 
//  Browser Sync Task
//  This is like live reload, you make the change in the file and it is reflected in all your browsers.
//  It looks for syncing things in ./app/ folder
// 
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: "./app/"
		}
	});
});


// Task to run build server for testing final app
//  It looks for syncing things in ./build/ folder
gulp.task('build:serve', function(){
	browserSync({
		server: {
			baseDir: "./build/"
		}
	});
});


// 
//  Watch Task
// 

gulp.task('watch', function() {
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['compass']);
	gulp.watch('app/**/*.html', ['html']);
});

// 
//  Default Task
// 
gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);


