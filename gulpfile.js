const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
 
gulp.task('clean', () => {
    return gulp
        .src('dist/*')
        .pipe(clean());
});
 
gulp.task('static', gulp.series('clean', () => {
     gulp
        .src(['src/**/*.json', 'src/**/*.ejs'])
        .pipe(gulp.dest('dist'));
return gulp
        .src(['docs/**/*'])
        .pipe(gulp.dest('dist/views/docs'));
        
}));
 
gulp.task('scripts', gulp.series('static', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(gulp.dest('dist'));
}));
 
gulp.task('build', gulp.series('scripts'));
 
gulp.task('development', () => {
    return gulp.watch(['src/**/*.ts', 'src/**/*.json'], gulp.series('build'));
});

gulp.task('homolog',()=>{
    return gulp.src(['src/**/*.ts', 'src/**/*.json'], gulp.series('build'));
});

gulp.task('production',()=>{
    return gulp.src(['src/**/*.ts', 'src/**/*.json'], gulp.series('build'));
});

gulp.task('default', gulp.series('build',process.env.NODE_ENV));
