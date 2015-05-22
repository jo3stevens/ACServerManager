gulp = require 'gulp'
coffee = require 'gulp-coffee'
plumber = require 'gulp-plumber'
gutil = require 'gulp-util'

gulp.task 'coffee', ->
	gulp.src('./src/*.coffee')
		.pipe coffee({bare: true}).on('error', gutil.log)
		.pipe gulp.dest('./lib/')

gulp.task 'default', ['coffee'], ->
	gulp.watch 'src/**/*.coffee', ['coffee']