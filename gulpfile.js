'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var data = require('gulp-data');
var fs = require('fs');
var nunjucks = require('gulp-nunjucks-html');
var nunjucksRender = require('gulp-nunjucks-render');
var inlineCss = require('gulp-inline-css');
var prompt = require('gulp-prompt');
var gulpSequence = require('gulp-sequence');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('prodCompile', function(){
    return gulp.src('src/templates/*.html')
    .pipe(nunjucks({
      searchPaths: ['src/templates'],
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    }))
    .on('error', function(error){
        console.log('error: ', error)
    })
    .pipe(inlineCss({
        applyStyleTags: true,
        applyLinkTags: true,
    }))
   .pipe(gulp.dest('template'));
});

gulp.task('devCompile', function(){
    return gulp.src('src/templates/*.html')
    .pipe(nunjucks({
      searchPaths: ['src/templates'],
      tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
      }
    }))
    .on('error', function(error){
        console.log('error: ', error)
    })
   .pipe(gulp.dest('src/compiled'))
   .pipe(inlineCss({
       applyStyleTags: true,
       applyLinkTags: true,
   }))
   .pipe(gulp.dest('src/styled'));
});

gulp.task('dev', gulpSequence('sass', 'devCompile'));
gulp.task('prod', gulpSequence('sass', 'prodCompile'));

gulp.task('render', function(){
    var templateFile;
    var dataFile;

    return gulp.src('*')
        .pipe(prompt.prompt([{
            type: 'input',
            name: 'template',
            message: "What template would you like to render? (testing.html)"
        },
        {
            type: 'input',
            name: 'data',
            message: "What data file would you like to use for " + templateFile + "? (testing.json)"
        }], function(res){
            templateFile = 'src/styled/' + res.template;
            console.log('template: ', res.template);

            dataFile = 'data/' + res.data;
            console.log('data: ', res.data);

            gulp.src(templateFile)
                .pipe(data(function () {
                    return JSON.parse(fs.readFileSync(dataFile));
                }))
                .pipe(nunjucksRender({
                    path: ['src/styled/']
                }))
                .pipe(gulp.dest('src/rendered'));
        }));
});
