'use strict';

var gulp = require('gulp');
var bs = require('browser-sync').create();
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'run-sequence'],
});
var _ = require('lodash');
var path = require('path');
var wiredep = require('wiredep').stream;
var argv = require('yargs').default('environment', 'dev').argv;
var del = require('del');
var gulpUtil = require('gulp-util');


var config = {
    paths: {
        src: 'src',
        dist: 'dist',
        tmp: '.tmp'
    },
    wiredep: {
        directory: 'bower_components',
        "overrides": {
            "bootstrap": {
                "main": ['dist/css/bootstrap.css', 'dist/js/bootstrap.js']
            },
            "font-awesome": {
                "main": ['css/font-awesome.css']
            }
        },
    },
    host: "192.168.1.168" //host ip for browsersync
};


var lib_paths = {
    data: ['src/data/**'],
    images: ['src/images/**'],
    js: [
        'node_modules/leaflet/dist/leaflet.js',
        'node_modules/leaflet-geometryutil/src/leaflet.geometryutil.js',
        'node_modules/leaflet-loading/src/Control.Loading.js',
        'node_modules/leaflet-polylinedecorator/dist/leaflet.polylineDecorator.js',
        'node_modules/leaflet-search/dist/leaflet-search.src.js',
        'node_modules/proj4/dist/proj4.js',
        'node_modules/proj4leaflet/src/proj4leaflet.js',
        'node_modules/lodash/lodash.js',
        'node_modules/geojson-utils/geojson-utils.js',
        'node_modules/jquery/dist/jquery.js',
        'node_modules/popper.js/dist/umd/popper.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/shards-ui/dist/js/shards.js',
    ],
    css: [
        'node_modules/leaflet/dist/leaflet.css',
        'node_modules/leaflet-loading/src/Control.Loading.css',
        'node_modules/leaflet-search/dist/leaflet-search.src.css',
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/shards-ui/dist/css/shards.css'
    ]
};

function errorHandler(title) {
    return function (err) {
        gulpUtil.log(gulpUtil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    }
}


gulp.task('dev', function (callback) {
    argv.environment = 'dev';
    $.runSequence('clean', [ 'inject', 'watch', 'serve:dev'], callback)
});

gulp.task('serve:dev', function () {
    bs.init({
        server: {
            baseDir: [path.join(config.paths.tmp, '/serve'), config.paths.src],
            routes: {
                '/bower_components': 'bower_components',
                '/node_modules': 'node_modules'
            }
        },
        startPath: '/',
        browser: 'default',
        host: config.host
    });
});

gulp.task('serve:dist', function () {
    bs.init({
        server: {
            baseDir: [path.join(config.paths.dist)],
        },
        startPath: '/',
        browser: 'default',
        host: config.host
    });
});


// cleans the build output
gulp.task('clean', function () {
    return del([
        path.join(config.paths.tmp, '**/*')
    ]);
});

// cleans the build output
gulp.task('clean-dist', function () {
    return del([
        path.join(config.paths.dist, '**/*')
    ]);
});



gulp.task('inject', ['environment-config', 'scripts', 'styles'], function () {
    var injectStyles = gulp.src([
        path.join(config.paths.tmp, '/serve/app/**/*.css'),
        path.join('!' + config.paths.tmp, '/serve/app/vendor.css'),
    ], {
        read: false
    });

    var injectScripts = gulp.src([
        path.join(config.paths.tmp, '/serve/*.js'),
        path.join(config.paths.src, '/**/*.js')
    ]).pipe($.angularFilesort()).
    on('error', errorHandler('AngularFilesort'));

    var injectVendorScripts = gulp.src(lib_paths.js, {
        read: false
    });
    var injectVendorStyles = gulp.src(lib_paths.css, {
        read: false
    });


    var injectOptions = {
        addRootSlash: false,
        ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
    };

    return gulp.src(path.join(config.paths.src, '/*.html')).
    pipe($.inject(injectStyles, injectOptions)).
    pipe($.inject(injectScripts, injectOptions)).
    pipe($.inject(injectVendorScripts, {
        name: 'vendor_scripts',
        relative: true
    })).
    pipe($.inject(injectVendorStyles, {
        name: 'vendor_styles',
        relative: true
    })).
    pipe(wiredep(_.extend({}, config.wiredep))).
    pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
});

gulp.task('scripts', function () {
    return gulp.src(path.join(config.paths.src, '/**/*.js')).
    pipe($.size());
});

var buildStyles = function () {
    var injectFiles = gulp.src([
        path.join(config.paths.src, '/**/*.less'),
        path.join('!' + config.paths.src, '/index.less')
    ], {
        read: false
    });

    var injectOptions = {
        addRootSlash: false,
        transform: function (filePath) {
            filePath = filePath.replace(config.paths.src + '/src/', '');
            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector'
    };

    return gulp.src([path.join(config.paths.src, '/index.less')]).
    pipe($.inject(injectFiles, injectOptions)).
    pipe($.sourcemaps.init()).
    pipe($.less()).
    on('error', errorHandler('Less')).
    pipe($.autoprefixer()).
    on('error', errorHandler('Autoprefixer')).
    pipe($.sourcemaps.write('maps')).
    pipe(gulp.dest(path.join(config.paths.tmp, '/serve/app/')));
}

gulp.task('styles', function () {
    return buildStyles();
});

gulp.task('styles-reload', function () {
    return buildStyles().pipe(bs.stream({
        match: '**/*.css'
    }));
});

gulp.task('environment-config', function () {
    return gulp.src('./src/config.json')
        .pipe($.ngConfig('app.config', {
            environment: ['env.' + argv.environment, 'global']
        }))
        .pipe(gulp.dest('.tmp/serve'))
});


gulp.task('build-template-cache', function () {
    return gulp.src(['./src/app/**/*.html'])
        .pipe($.ngHtml2js({
            moduleName: 'app.templatecache',
            prefix: 'app/'
        }))
        .pipe($.concat('templateCache.js'))
        .pipe(gulp.dest('.tmp/serve'));
});


gulp.task('copy', function () {
    gulp.src(lib_paths.data)
        .pipe(gulp.dest(path.join(config.paths.dist, '/data/')));

    gulp.src(lib_paths.images)
        .pipe(gulp.dest(path.join(config.paths.dist, '/images/')));

    gulp.src($.mainBowerFiles().concat(_.map(_.keys(config.wiredep.overrides), function (dependency) {
        return 'bower_components/' + dependency + '/**/*'
    }))).
    pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}')).
    pipe($.flatten()).
    pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
});


gulp.task('watch', function () {
    gulp.watch('src/**/*.html').on('change', bs.reload);
    gulp.watch('src/**/*.js').on('change', bs.reload);
    gulp.watch('src/**/*.less', ['styles-reload']);
});

gulp.task('build', function (callback) {
    if (!argv.environment) argv.environment = 'prod';
    $.runSequence(['clean', 'clean-dist'], ['build-template-cache'], ['html', 'copy'], callback);
});

gulp.task('html', ['inject'], function () {

    var cssFilter = $.filter('**/*.css', {
        restore: true
    });
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var htmlFilter = $.filter('*.html', {
        restore: true
    });

    return gulp.src(path.join(config.paths.tmp, '/serve/*.html')).
    pipe($.useref()).
    pipe(jsFilter).
    pipe($.rev()).
    pipe($.sourcemaps.init()).
    pipe($.ngAnnotate()).
    pipe($.uglify({
        output: {
            comments: 'some'
        }
    })).
    on('error', errorHandler('Uglify')).
    pipe($.sourcemaps.write('maps')).
    pipe(jsFilter.restore).
    pipe(cssFilter).
    pipe($.rev()).
    pipe($.sourcemaps.init()).
    pipe($.cssnano({
        zindex: false
    })).
    pipe($.sourcemaps.write('maps')).
    pipe(cssFilter.restore).
    pipe($.revReplace()).
    pipe(htmlFilter).
    pipe($.htmlmin(config.htmlminOptions)).
    pipe(htmlFilter.restore).
    pipe(gulp.dest(path.join(config.paths.dist, '/'))).
    pipe($.size({
        title: path.join(config.paths.dist, '/'),
        showFiles: true
    }));
});