  'use strict';

var gulp = require('gulp');

var reload = require("browser-sync").create();
var prefixer = require('gulp-autoprefixer');
var cached = require('gulp-cached');//Кэширование для оптимизации
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var imageminPng = require('imagemin-pngquant');
var less = require('gulp-less');
var newer = require('gulp-newer');
var remember = require('gulp-remember');
var rigger = require('gulp-rigger'); // Красивая вставка через //= '*.*'
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var del = require('del');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var rename = require("gulp-rename");
var htmlmin = require('gulp-htmlmin');

gulp.task('del:build', function () {
   
    gulp.src('src/build/**//*.*') //Выберем наш build
        .pipe(debug({ title: 'src' })) //Показ происходящего
        .pipe(del())
        .pipe(gulp.dest('build'))
});


gulp.task('html:build', function () {
    
    gulp.src('src/html/**/index.html') 
        .pipe(debug({title: 'src'}))
        .pipe(remember('html:build')) //Оптимизация
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(debug({title: 'rigger'}))
        .pipe(debug({title: 'HTMLmin'}))
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest('build'))
});

gulp.task('html:prod', function () {

    gulp.src('src/html/**/index.html') 
        .pipe(debug({title: 'src'}))
        .pipe(remember('html:build')) //Оптимизация
        .pipe(rigger())
        .pipe(debug({title: 'rigger'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(debug({title: 'HTMLmin'}))
        .pipe(gulp.dest('production'))
});


gulp.task('style:build', ['less:build'], function () {
   
    gulp.src('src/less/**/style.less') //Выберем наш style.less
    	.pipe(debug({title: 'src'})) //Показ происходящего
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        //.pipe(concat('style.css')) //Объеденим в один файл
        .pipe(less()) //Скомпилируем
        .pipe(debug({title: 'less'})) //Показ происходящего
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(debug({title: 'prefixer'})) //Показ происходящего
        .pipe(cleanCSS()) //Сожмем
        .pipe(debug({title: 'cleanCSS'})) //Показ происходящего
        .pipe(rename('style.min.css'))
        .pipe(debug({title: 'rename in style.min'})) //Показ происходящего
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest('build/css/')) //И в build
});

gulp.task('style:prod', function () {
   
    gulp.src('src/less/**/style.less') //Выберем наш style.less
        .pipe(debug({title: 'src'})) //Показ происходящего
        .pipe(less()) //Скомпилируем
        .pipe(debug({title: 'less'})) //Показ происходящего
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(debug({title: 'prefixer'})) //Показ происходящего
        .pipe(cleanCSS()) //Сожмем
        .pipe(debug({title: 'cleanCSS'})) //Показ происходящего
        .pipe(rename('style.min.css'))
        .pipe(debug({title: 'rename in style.min'})) //Показ происходящего
        .pipe(gulp.dest('production/css/')) //И в build
});

gulp.task('less:build', function () {
   
    gulp.src('src/less/**/style.less') //Выберем наш style.less
        .pipe(debug({title: 'src'})) //Показ происходящего
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(less('')) //Скомпилируем
        .pipe(debug({title: 'less'})) //Показ происходящего
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(debug({title: 'prefixer'})) //Показ происходящего
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest('build/css')) //И в build
});



gulp.task('img:build', function () {
    gulp.src('src/img/**/*.*')//Выберем наши картинки
        .pipe(debug({title: 'src'}))
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPng()],
            interlaced: true
        }))
        .pipe(debug({title: 'img-min'}))
        .pipe(gulp.dest('build/img'))
});


gulp.task('sync', function() {
  	reload.init({
    	server: "build"
	});
	reload.watch('build').on('change', reload.reload);
});

gulp.task('svgstore:build', function () {
    gulp.src('src/image/SVG/*.svg')
        .pipe(debug({title: 'src'}))
        .pipe(svgmin())
        .pipe(debug({title: 'svgmin'}))
        .pipe(svgstore())
        .pipe(debug({title: 'svgstore'}))
        .pipe(gulp.dest('build/SpriteSVG'));
});

gulp.task('js:build', function () {
    
    gulp.src('src/js/**/*.js') 
        .pipe(debug({title: 'src'}))
        .pipe(sourcemaps.init())
        .pipe(concat('common.js'))
        .pipe(debug({title: 'concat'}))
        //.pipe(uglify())
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest('build/js'))
});

gulp.task('js:prod', function () {
    
    gulp.src('src/js/**/*.js') 
        .pipe(debug({title: 'src'}))
        .pipe(concat('common.js'))
        .pipe(debug({title: 'concat'}))
        .pipe(uglify())
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest('production/js'))
});


gulp.task('watch', function () {
    // Endless stream mode 
    watch('src/less/**//*.*', (events, done) =>
            {
            	gulp.start('style:build');
            });
    watch('src/html/**//*.*', (events, done) =>
            {
            	gulp.start('html:build');
            }).on('unlink', function (filepath) {
            	remember.forget('html:buld', path.resolve(filepath));
            });
    watch('src/js/**//*.*', (events, done) =>
            {
                gulp.start('js:build')
            });

});

gulp.task('default',  ['sync', 'js:build', 'watch'], function () {
  // place code for your default task here
});

