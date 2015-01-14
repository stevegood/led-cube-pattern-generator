var gulp = require('gulp');

gulp.task('jquery', function(){
    var jqpath = 'bower_components/jquery/dist/';
    return gulp.src(jqpath + 'jquery.min.js')
        .pipe(gulp.dest('dist/' + jqpath));
});

gulp.task('bootstrap', function(){
    var bspath = 'bower_components/bootstrap/dist/';
    return gulp.src(bspath + '**/*')
        .pipe(gulp.dest('dist/' + bspath));
});

gulp.task('requirejs', function(){
    var rqpath = 'bower_components/requirejs/';
    return gulp.src(rqpath + 'require.js')
        .pipe(gulp.dest('dist/' + rqpath));
});

gulp.task('js', function(){
    var jspath = 'js/';
    return gulp.src(jspath + '**/*.js')
        .pipe(gulp.dest('dist/' + jspath));
});

gulp.task('css', function(){
    var csspath = 'css/';
    return gulp.src(csspath + '**/*.css')
        .pipe(gulp.dest('dist/' + csspath));
});

gulp.task('html', function(){
    return gulp.src('index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('ghpages', ['jquery', 'bootstrap', 'requirejs', 'js', 'css', 'html']);