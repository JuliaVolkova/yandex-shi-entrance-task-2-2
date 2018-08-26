import del from 'del';
import gulp from 'gulp';
import sass from 'gulp-sass';
import sassLint from 'gulp-sass-lint';
import connect from 'gulp-connect';
import rename from 'gulp-rename';
import ghPages from 'gulp-gh-pages';
import normalize from 'node-normalize-scss';

/**
 * HTML task
 */
gulp.task('html', () => {
    return gulp.src('src/html/**/*.html')
        .pipe(gulp.dest('build'));
});

/**
 * Fonts task
 */
gulp.task('fonts', () => {
    return gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest('build/fonts'));
});

/**
 * Images task
 */
gulp.task('images', () => {
    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('build/img'));
});

/**
 * Styles task
 */
gulp.task('styles', () => {
    return gulp.src('src/sass/index.sass')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: normalize.includePaths
        }).on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('build/css/'));
});

/**
 * Connect task
 */
gulp.task('connect', () => {
    connect.server({
        root: ['build'],
        livereload: true
    });
});

/**
 * Watch task
 */
gulp.task('watch', ['connect'], () => {
    gulp.watch(
        ['src/html/*.html',
            'src/sass/**/*.sass'
        ],
        (event) => gulp.src(event.path).pipe(connect.reload()));

    gulp.watch('src/html/*.html', ['html']);
    gulp.watch('src/sass/**/*.sass', ['styles']);
});

/**
 * Clean build task
 */
gulp.task('clean', () => {
    del(['build']);
});

/**
 * Build task
 */
gulp.task('build', ['html', 'fonts', 'images', 'styles']);

/**
 * Lint sass
 */
gulp.task('lint_sass', () => {
    return gulp.src('src/sass/**/*.s+(a|c)ss')
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

/**
 * Lint task
 */
gulp.task('lint', ['lint_sass']);

/**
 * Test task
 */
gulp.task('test', ['lint'], () => {
    return true;
});

gulp.task('default', ['build']);

gulp.task('deploy', ['build'], () => {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});
